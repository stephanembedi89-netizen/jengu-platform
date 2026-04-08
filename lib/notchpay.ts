// ── NotchPay integration — Fisco.IA ──────────────────────────
// Docs: https://developer.notchpay.co
// Base URL: https://api.notchpay.co

const NOTCHPAY_BASE = 'https://api.notchpay.co';

export type Plan = 'solo' | 'pro' | 'cabinet';
export type Billing = 'monthly' | 'annual';

export const PLAN_PRICES: Record<Plan, Record<Billing, number>> = {
  solo:    { monthly: 4_900,  annual: 49_000  },
  pro:     { monthly: 9_900,  annual: 99_000  },
  cabinet: { monthly: 24_900, annual: 249_000 },
};

export const PLAN_LABELS: Record<Plan, string> = {
  solo:    'Fisco.IA Solo',
  pro:     'Fisco.IA Pro',
  cabinet: 'Fisco.IA Cabinet',
};

export interface InitPaymentParams {
  plan: Plan;
  billing: Billing;
  email: string;
  name: string;
  phone?: string;
  locale?: string;
}

export interface NotchPayTransaction {
  reference: string;
  authorization_url: string;
  amount: number;
  currency: string;
  status: string;
}

export type InitPaymentResult =
  | { ok: true;  transaction: NotchPayTransaction }
  | { ok: false; error: string };

/**
 * Initiate a NotchPay payment.
 * Returns authorization_url to redirect the user to.
 */
export async function initiatePayment(params: InitPaymentParams): Promise<{ ok: true; transaction: NotchPayTransaction } | { ok: false; error: string }> {
  const { plan, billing, email, name, phone, locale = 'fr' } = params;
  const amount   = PLAN_PRICES[plan][billing];
  const label    = PLAN_LABELS[plan];
  const period   = billing === 'annual'
    ? (locale === 'fr' ? 'annuel' : 'annual')
    : (locale === 'fr' ? 'mensuel' : 'monthly');
  const ref      = `FISCO-${plan.toUpperCase()}-${Date.now()}`;
  const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  const body = {
    email,
    amount,
    currency:    'XAF',
    description: `${label} — abonnement ${period}`,
    reference:   ref,
    callback:    `${baseUrl}/api/payment/callback?ref=${ref}`,
    // return_url after payment page
    metadata: { plan, billing, name, phone: phone ?? '' },
  };

  try {
    const res = await fetch(`${NOTCHPAY_BASE}/payments`, {
      method:  'POST',
      headers: {
        'Authorization': process.env.NOTCHPAY_PUBLIC_KEY ?? '',
        'Content-Type':  'application/json',
        'Accept':        'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok || !data?.transaction?.authorization_url) {
      return { ok: false, error: data?.message ?? `HTTP ${res.status}` };
    }

    return { ok: true, transaction: data.transaction as NotchPayTransaction };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Verify a payment by reference (server-side, uses private key).
 */
export async function verifyPayment(reference: string): Promise<{ ok: boolean; status: string; amount?: number }> {
  try {
    const res = await fetch(`${NOTCHPAY_BASE}/payments/${reference}`, {
      headers: {
        'Authorization': process.env.NOTCHPAY_PRIVATE_KEY ?? '',
        'Accept':        'application/json',
      },
    });
    const data = await res.json();
    return {
      ok:     res.ok,
      status: data?.transaction?.status ?? 'unknown',
      amount: data?.transaction?.amount,
    };
  } catch {
    return { ok: false, status: 'error' };
  }
}
