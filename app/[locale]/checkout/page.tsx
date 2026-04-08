'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Loader2, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useLangStore } from '@/lib/i18n/useTranslation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TARIFS } from '@/lib/constants';
import Link from 'next/link';

type Plan    = 'solo' | 'pro' | 'cabinet';
type Billing = 'monthly' | 'annual';

const PLAN_INFO: Record<Plan, { fr: string; en: string; color: string }> = {
  solo:    { fr: 'Solo',    en: 'Solo',    color: 'text-blue-glow' },
  pro:     { fr: 'Pro',     en: 'Pro',     color: 'text-gold' },
  cabinet: { fr: 'Cabinet', en: 'Cabinet', color: 'text-blue-electric' },
};

function CheckoutForm() {
  const params  = useSearchParams();
  const router  = useRouter();
  const { locale } = useLangStore();

  const plan    = (params.get('plan') ?? 'pro')    as Plan;
  const billing = (params.get('billing') ?? 'monthly') as Billing;
  const fr      = locale !== 'en';

  const tarif = TARIFS[plan];
  const price = billing === 'annual' ? tarif.prix_annuel : tarif.prix_mensuel;
  const info  = PLAN_INFO[plan];

  const [form, setForm]     = useState({ name: '', email: '', phone: '' });
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoad(true);

    try {
      const res = await fetch('/api/payment/initiate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ plan, billing, ...form, locale }),
      });
      const data = await res.json();

      if (!res.ok || !data.authorization_url) {
        setError(data.error ?? (fr ? 'Erreur de paiement.' : 'Payment error.'));
        return;
      }

      // Redirect to NotchPay hosted payment page
      window.location.href = data.authorization_url;
    } catch {
      setError(fr ? 'Erreur réseau. Réessayez.' : 'Network error. Please retry.');
    } finally {
      setLoad(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-8">
      {/* Back */}
      <Link href={`/${locale}/tarifs`} className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        {fr ? 'Retour aux forfaits' : 'Back to plans'}
      </Link>

      {/* Order summary */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card padding="md" glow={plan === 'pro' ? 'gold' : 'blue'} className={plan === 'pro' ? 'border-gold/25' : ''}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted mb-0.5">{fr ? 'Forfait sélectionné' : 'Selected plan'}</p>
              <h2 className={`font-display text-2xl font-bold ${info.color}`}>
                Fisco.IA {fr ? info.fr : info.en}
              </h2>
              <p className="text-sm text-text-secondary mt-0.5">
                {billing === 'annual'
                  ? (fr ? 'Abonnement annuel' : 'Annual subscription')
                  : (fr ? 'Abonnement mensuel' : 'Monthly subscription')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl font-bold text-text-primary">
                {price.toLocaleString('fr-FR')}
              </p>
              <p className="text-xs text-text-muted">
                FCFA{billing === 'annual' ? (fr ? '/an' : '/yr') : (fr ? '/mois' : '/mo')}
              </p>
              {billing === 'annual' && (
                <p className="text-[11px] text-success mt-0.5">
                  {fr ? '2 mois offerts' : '2 months free'}
                </p>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Payment methods info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-navy-card/50 border border-white/[0.07]">
          <Smartphone className="w-5 h-5 text-success flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {fr ? 'Paiement mobile money' : 'Mobile money payment'}
            </p>
            <p className="text-xs text-text-muted">
              MTN Mobile Money · Orange Money · Virement bancaire
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}>
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-5">
            <CreditCard className="w-5 h-5 text-blue-electric" />
            <h3 className="font-display text-base font-semibold text-text-primary">
              {fr ? 'Vos informations' : 'Your details'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-secondary">
                {fr ? 'Nom complet' : 'Full name'} *
              </label>
              <input
                className="input-field"
                type="text"
                required
                placeholder={fr ? 'Jean Dupont' : 'John Doe'}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-secondary">
                Email *
              </label>
              <input
                className="input-field"
                type="email"
                required
                placeholder="jean@example.cm"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-secondary">
                {fr ? 'Numéro Mobile Money' : 'Mobile Money number'}
                <span className="text-text-muted font-normal ml-1">({fr ? 'facultatif' : 'optional'})</span>
              </label>
              <input
                className="input-field"
                type="tel"
                placeholder="+237 6XX XXX XXX"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
              <p className="text-[11px] text-text-muted">
                {fr
                  ? 'MTN MoMo (67x/68x) ou Orange Money (69x/65x)'
                  : 'MTN MoMo (67x/68x) or Orange Money (69x/65x)'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-danger/10 border border-danger/25">
                <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0" />
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading} loading={loading}>
              {loading
                ? (fr ? 'Connexion au paiement...' : 'Connecting to payment...')
                : (fr ? `Payer ${price.toLocaleString('fr-FR')} FCFA` : `Pay ${price.toLocaleString('fr-FR')} FCFA`)}
            </Button>

            <p className="text-center text-[11px] text-text-muted">
              🔒 {fr
                ? 'Paiement sécurisé via NotchPay · Annulation à tout moment'
                : 'Secure payment via NotchPay · Cancel anytime'}
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-electric animate-spin" />
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
