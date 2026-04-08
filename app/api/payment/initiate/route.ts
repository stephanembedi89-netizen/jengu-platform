import { NextRequest, NextResponse } from 'next/server';
import { initiatePayment, type Plan, type Billing } from '@/lib/notchpay';

export async function POST(req: NextRequest) {
  try {
    const { plan, billing, email, name, phone, locale } = await req.json();

    // Validate
    const validPlans: Plan[]     = ['solo', 'pro', 'cabinet'];
    const validBilling: Billing[] = ['monthly', 'annual'];

    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }
    if (!validBilling.includes(billing)) {
      return NextResponse.json({ error: 'Période invalide' }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Nom requis' }, { status: 400 });
    }

    const result = await initiatePayment({ plan, billing, email, name, phone, locale });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json({ authorization_url: result.transaction.authorization_url, reference: result.transaction.reference });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
