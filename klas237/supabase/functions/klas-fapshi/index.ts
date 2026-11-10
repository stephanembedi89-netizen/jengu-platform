// Klas 237 × Fapshi (Orange Money, MTN MoMo) : création d'un paiement, vérification au retour, avis de paiement.
// Les clés Fapshi restent ici, dans les secrets Supabase. Le prix est fixé côté serveur, jamais par le navigateur,
// et vérifié une deuxième fois par la base (contrainte et déclencheur private.apply_verified_klas_payment).
// Secrets : FAPSHI_APIUSER (ou FAPSHI_API_USER), FAPSHI_APIKEY (ou FAPSHI_API_KEY), FAPSHI_WEBHOOK_SECRET,
//           FAPSHI_MODE=live et FAPSHI_LIVE_ENABLED=true pour encaisser réellement, KLAS_APP_URL (adresse du site).
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const API_USER = Deno.env.get("FAPSHI_APIUSER") || Deno.env.get("FAPSHI_API_USER") || "";
const API_KEY = Deno.env.get("FAPSHI_APIKEY") || Deno.env.get("FAPSHI_API_KEY") || "";
const LIVE = Deno.env.get("FAPSHI_MODE") === "live" && Deno.env.get("FAPSHI_LIVE_ENABLED") === "true" && !API_KEY.startsWith("FAK_TEST_");
const MODE = LIVE ? "live" : "sandbox";
const BASE = LIVE ? "https://live.fapshi.com" : "https://sandbox.fapshi.com";
const APP_URL = (Deno.env.get("KLAS_APP_URL") || "https://klas237.netlify.app").replace(/\/$/, "");
const ORIGINS = [APP_URL, "https://klas237.netlify.app", "https://klas237.jengu-ai.com"];
const VALID_STATUS = ["CREATED", "PENDING", "SUCCESSFUL", "FAILED", "EXPIRED"];

// Offres sans prélèvement automatique : 1 mois (prix de base), 3 mois (× 2,7) ou 12 mois (× 10).
// Doit rester identique à private.klas_plan_amount (migration 20261110), qui revérifie chaque montant.
function plan(input: { plan?: unknown; kids?: unknown; months?: unknown }): { code: string; amount: number; label: string } | null {
  let code = "", base = 0, name = "";
  if (input.plan === "famille") {
    const kids = Math.trunc(Number(input.kids));
    if (!(kids >= 1 && kids <= 10)) return null;
    code = `famille_${kids}`; base = 2500 + 1500 * (kids - 1); name = `Famille · ${kids} enfant${kids > 1 ? "s" : ""}`;
  } else if (input.plan === "eleve") { code = "eleve"; base = 2000; name = "Élève"; }
  else if (input.plan === "enseignant") { code = "enseignant"; base = 5000; name = "Enseignant"; }
  else if (input.plan === "accompagnateur") { code = "accompagnateur"; base = 5000; name = "Accompagnateur"; }
  else return null;
  const months = Number(input.months ?? 1);
  if (months === 3) return { code: code + "@3", amount: (base * 27) / 10, label: `Klas 237 ${name} · 3 mois` };
  if (months === 12) return { code: code + "@12", amount: base * 10, label: `Klas 237 ${name} · 12 mois` };
  if (months === 1) return { code, amount: base, label: `Klas 237 ${name} · 1 mois` };
  return null;
}

function respond(req: Request, body: unknown, status = 200) {
  const origin = req.headers.get("origin") || "";
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...(ORIGINS.includes(origin) ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}) },
  });
}
async function db(path: string, method = "GET", body?: unknown) {
  const r = await fetch(SUPABASE_URL + "/rest/v1/" + path, {
    method,
    headers: { apikey: SERVICE_KEY, Authorization: "Bearer " + SERVICE_KEY, "Content-Type": "application/json", Prefer: "return=representation" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!r.ok) throw Error("db " + r.status + " " + (await r.text()).slice(0, 200));
  return r.json();
}
async function fapshi(path: string, method = "GET", body?: unknown) {
  const r = await fetch(BASE + path, {
    method,
    headers: { apiuser: API_USER, apikey: API_KEY, "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const out = await r.json().catch(() => ({}));
  if (!r.ok) throw Error("fapshi " + r.status);
  return out;
}
async function authenticatedUser(req: Request) {
  const authorization = req.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) return null;
  const r = await fetch(SUPABASE_URL + "/auth/v1/user", { headers: { apikey: SERVICE_KEY, Authorization: authorization } });
  return r.ok ? await r.json() : null;
}
function sameSecret(a: string, b: string) {
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  if (!x.length || x.length !== y.length) return false;
  let d = 0;
  for (let i = 0; i < x.length; i++) d |= x[i] ^ y[i];
  return d === 0;
}

// Les avis Fapshi ne sont pas signés : on revérifie toujours le paiement directement auprès de Fapshi.
// Le passage à SUCCESSFUL déclenche, dans la base, l'ouverture ou la prolongation de 30 jours de l'accès.
// deno-lint-ignore no-explicit-any
async function reconcile(order: any) {
  if (!order.trans_id || order.status === "SUCCESSFUL") return order;
  const raw = await fapshi("/payment-status/" + encodeURIComponent(order.trans_id));
  const p = Array.isArray(raw) ? raw[0] : raw;
  if (!p || p.transId !== order.trans_id || p.externalId !== order.id || p.userId !== order.owner_id || !VALID_STATUS.includes(p.status)) throw Error("Payment identity mismatch");
  if (p.status === "SUCCESSFUL" && Number(p.amount) < order.amount_xaf) throw Error("Underpaid");
  if (p.status === order.status) return order;
  const rows = await db("klas_payment_orders?id=eq." + order.id + "&status=neq.SUCCESSFUL", "PATCH", { status: p.status, checked_at: new Date().toISOString() });
  return rows[0] || order;
}

async function webhook(req: Request) {
  const secret = Deno.env.get("FAPSHI_WEBHOOK_SECRET") || "";
  const given = req.headers.get("x-wh-secret") || new URL(req.url).searchParams.get("token") || "";
  if (!sameSecret(given, secret)) return respond(req, { error: "Unauthorized" }, 401);
  const raw = await req.json().catch(() => null);
  const notice = Array.isArray(raw) ? raw[0] : raw;
  if (typeof notice?.transId !== "string" || notice.transId.length > 100) return respond(req, { ok: true });
  const rows = await db("klas_payment_orders?trans_id=eq." + encodeURIComponent(notice.transId) + "&environment=eq." + MODE + "&select=*");
  if (rows.length) await reconcile(rows[0]);
  return respond(req, { ok: true });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    const origin = req.headers.get("origin") || "";
    return new Response(null, { status: 204, headers: { ...(ORIGINS.includes(origin) ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}), "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" } });
  }
  if (req.method !== "POST") return respond(req, { error: "Method not allowed" }, 405);
  if (!SUPABASE_URL || !SERVICE_KEY || !API_USER || !API_KEY) return respond(req, { error: "Le paiement n'est pas encore configuré." }, 503);
  try {
    if (new URL(req.url).searchParams.get("webhook") === "1") return await webhook(req);
    const user = await authenticatedUser(req);
    if (!user?.id || !user?.email) return respond(req, { error: "Connectez-vous pour payer." }, 401);
    const input = await req.json().catch(() => ({}));

    if (input.action === "start") {
      const offer = plan(input);
      if (!offer) return respond(req, { error: "Offre inconnue." }, 400);
      // Un double clic ne crée pas deux paiements : on réutilise la commande identique de moins de 5 minutes.
      const since = encodeURIComponent(new Date(Date.now() - 5 * 60 * 1000).toISOString());
      const recent = await db(`klas_payment_orders?owner_id=eq.${user.id}&environment=eq.${MODE}&plan_code=eq.${offer.code}&status=in.(CREATED,PENDING)&created_at=gte.${since}&order=created_at.desc&limit=1&select=*`);
      if (recent[0]?.payment_link) return respond(req, { orderId: recent[0].id, link: recent[0].payment_link, mode: MODE, amount: offer.amount });
      const id = crypto.randomUUID();
      await db("klas_payment_orders", "POST", { id, owner_id: user.id, plan_code: offer.code, amount_xaf: offer.amount, environment: MODE, status: "CREATED" });
      const payment = await fapshi("/initiate-pay", "POST", { amount: offer.amount, email: user.email, redirectUrl: APP_URL + "/?payment=return", userId: user.id, externalId: id, message: offer.label });
      const link = new URL(payment.link || "");
      if (link.protocol !== "https:" || !(link.hostname === "fapshi.com" || link.hostname.endsWith(".fapshi.com")) || typeof payment.transId !== "string") throw Error("Invalid checkout response");
      await db("klas_payment_orders?id=eq." + id, "PATCH", { status: "PENDING", trans_id: payment.transId, payment_link: link.href });
      return respond(req, { orderId: id, link: link.href, mode: MODE, amount: offer.amount });
    }

    // Au retour de la page Fapshi (ou depuis « Vérifier un paiement ») : revérifie les commandes en attente de ce compte.
    if (input.action === "verify" || input.action === "status") {
      const filter = typeof input.orderId === "string" && /^[a-f0-9-]{36}$/.test(input.orderId) ? "&id=eq." + input.orderId : "&status=in.(CREATED,PENDING,SUCCESSFUL)";
      const rows = await db(`klas_payment_orders?owner_id=eq.${user.id}&environment=eq.${MODE}${filter}&order=created_at.desc&limit=3&select=*`);
      if (!rows.length) return respond(req, { status: "NONE", mode: MODE });
      let best = rows[0];
      for (const r of rows) {
        const o = await reconcile(r).catch(() => r);
        if (o.status === "SUCCESSFUL") { best = o; break; }
        if (r === rows[0]) best = o;
      }
      const access = await db(`ndab_access?owner_id=eq.${user.id}&select=expires_at,plan_code`);
      return respond(req, { orderId: best.id, status: best.status, mode: MODE, accessUpdated: !!best.applied_at, expiresAt: access[0]?.expires_at || null });
    }
    return respond(req, { error: "Action inconnue." }, 400);
  } catch (error) {
    console.error("klas-fapshi", error instanceof Error ? error.message : String(error));
    return respond(req, { error: "Le paiement est momentanément indisponible. Réessayez dans un instant." }, 502);
  }
});
