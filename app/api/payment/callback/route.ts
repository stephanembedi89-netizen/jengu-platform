import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/notchpay';

// NotchPay redirects the user here after payment (GET)
// Also receives webhook notifications (POST)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref    = searchParams.get('ref')    ?? searchParams.get('reference') ?? '';
  const status = searchParams.get('status') ?? '';
  const locale = searchParams.get('locale') ?? 'fr';

  if (!ref) {
    return NextResponse.redirect(new URL(`/${locale}/tarifs`, req.url));
  }

  // Verify server-side
  const verification = await verifyPayment(ref);
  const paid = verification.status === 'complete' || verification.status === 'completed' || status === 'complete';

  const dest = paid
    ? `/${locale}/dashboard?payment=success&ref=${ref}`
    : `/${locale}/tarifs?payment=cancelled`;

  return NextResponse.redirect(new URL(dest, req.url));
}

export async function POST(req: NextRequest) {
  // Webhook from NotchPay (server-to-server notification)
  try {
    const payload = await req.json();
    const { reference, status } = payload?.data ?? {};

    if (!reference) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // TODO: save subscription status to DB (Supabase, PlanetScale, etc.)
    // For now: log and acknowledge
    console.log('[NotchPay webhook]', reference, status);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
