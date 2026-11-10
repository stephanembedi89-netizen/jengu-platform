-- Klas 237 · mise en ligne : offres payantes Fapshi (Orange Money, MTN MoMo) et quota de l'assistant IA.
-- Le prix de chaque offre est fixé ici, côté serveur : une commande dont le montant ne correspond pas n'ouvre aucun accès.

-- 1. Prix des offres (sans prélèvement automatique)
create or replace function private.klas_plan_base(p_code text)
returns integer language sql immutable set search_path to '' as $$
  select case
    when p_code = 'monthly_2500' then 2500                                   -- ancienne offre, gardée pour l'historique
    when p_code ~ '^famille_([1-9]|10)$' then 2500 + 1500 * (substring(p_code from 9)::int - 1)
    when p_code = 'eleve' then 2000
    when p_code = 'enseignant' then 5000
    when p_code = 'accompagnateur' then 5000
    else null end
$$;
-- Durée : « offre » = 1 mois, « offre@3 » = 3 mois (prix × 2,7), « offre@12 » = 12 mois (prix × 10).
create or replace function private.klas_plan_months(p_code text)
returns integer language sql immutable set search_path to '' as $$
  select case when p_code ~ '@3$' then 3 when p_code ~ '@12$' then 12 when p_code !~ '@' then 1 else null end
$$;
create or replace function private.klas_plan_amount(p_code text)
returns integer language sql immutable set search_path to '' as $$
  select case private.klas_plan_months(p_code)
    when 1 then private.klas_plan_base(p_code)
    when 3 then private.klas_plan_base(split_part(p_code, '@', 1)) * 27 / 10
    when 12 then private.klas_plan_base(split_part(p_code, '@', 1)) * 10
    else null end
$$;
revoke all on function private.klas_plan_base(text), private.klas_plan_months(text), private.klas_plan_amount(text) from public, anon, authenticated;
-- La contrainte de montant des commandes est vérifiée avec les droits du rôle service (fonction klas-fapshi).
grant usage on schema private to service_role;
grant execute on function private.klas_plan_base(text), private.klas_plan_months(text), private.klas_plan_amount(text) to service_role;

-- 2. L'offre en cours est notée sur l'accès (utile pour le support et, plus tard, pour limiter le nombre d'enfants)
alter table public.ndab_access add column if not exists plan_code text;

create or replace function private.klas_plan_days(p_code text)
returns interval language sql immutable set search_path to '' as $$
  select case private.klas_plan_months(p_code) when 3 then interval '90 days' when 12 then interval '365 days' else interval '30 days' end
$$;
revoke all on function private.klas_plan_days(text) from public, anon, authenticated;

-- 3. Ouverture de l'accès quand Fapshi confirme le paiement (déclencheur existant, désormais multi-offres et multi-durées)
create or replace function private.apply_verified_klas_payment()
returns trigger language plpgsql security definer set search_path to '' as $$
begin
  if new.status = 'SUCCESSFUL' and old.status <> 'SUCCESSFUL' and new.environment = 'live' then
    if new.trans_id is null or private.klas_plan_amount(new.plan_code) is null
       or new.amount_xaf <> private.klas_plan_amount(new.plan_code) then
      raise exception 'Invalid payment';
    end if;
    insert into public.ndab_access(owner_id, expires_at, plan_code)
    values (new.owner_id, now() + private.klas_plan_days(new.plan_code), new.plan_code)
    on conflict (owner_id) do update
      set expires_at = greatest(public.ndab_access.expires_at, now()) + private.klas_plan_days(new.plan_code),
          plan_code = excluded.plan_code;
    new.applied_at = now();
  end if;
  return new;
end;
$$;

-- 4. Commandes : une seule commande par transaction Fapshi, et des montants cohérents
--    (trans_id est déjà unique ; les anciennes contraintes fixaient 2 500 FCFA et une seule offre)
alter table public.klas_payment_orders drop constraint if exists klas_payment_orders_plan_code_check;
alter table public.klas_payment_orders drop constraint if exists klas_payment_orders_amount_xaf_check;
alter table public.klas_payment_orders add constraint klas_payment_orders_plan_amount_check
  check (amount_xaf = private.klas_plan_amount(plan_code));

-- 5. Assistant IA : réservation atomique d'une question (accès actif, plafond par personne et plafond global du jour)
--    Renvoie le numéro de la question du jour, ou 'no_access' / 'limit' / 'global'.
create or replace function public.klas_ai_take(p_user uuid, p_limit integer, p_global integer)
returns jsonb language plpgsql security definer set search_path to '' as $$
declare n integer; today date := (now() at time zone 'UTC')::date;
begin
  if not exists (select 1 from public.ndab_access where owner_id = p_user and expires_at > now()) then
    return to_jsonb('no_access'::text);
  end if;
  perform pg_advisory_xact_lock(2372026);
  if (select coalesce(sum(requests), 0) from public.klas_ai_usage where day = today) >= p_global then
    return to_jsonb('global'::text);
  end if;
  insert into public.klas_ai_usage(user_id, day, requests) values (p_user, today, 1)
  on conflict (user_id, day) do update set requests = public.klas_ai_usage.requests + 1
    where public.klas_ai_usage.requests < p_limit
  returning requests into n;
  if n is null then return to_jsonb('limit'::text); end if;
  return to_jsonb(n);
end;
$$;
revoke all on function public.klas_ai_take(uuid, integer, integer) from public, anon, authenticated;
grant execute on function public.klas_ai_take(uuid, integer, integer) to service_role;

-- L'ancienne réservation (plafonds fixes 10 et 20) est remplacée.
drop function if exists public.klas_take_ai_slot(uuid);
