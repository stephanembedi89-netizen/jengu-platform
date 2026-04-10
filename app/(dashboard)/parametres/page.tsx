import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Shield, Building2, CreditCard, CheckCircle } from 'lucide-react'
import { formatDate, PLAN_LIMITS } from '@/lib/utils'
import Link from 'next/link'

export const metadata = { title: 'Paramètres' }

export default async function ParametresPage() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') redirect('/dashboard')

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.tenantId },
    include: { _count: { select: { agents: true, contrats: true, prospects: true } } },
  })
  if (!tenant) redirect('/login')

  const planInfo = PLAN_LIMITS[tenant.plan as keyof typeof PLAN_LIMITS]
  const trialDaysLeft = tenant.trialEndsAt
    ? Math.ceil((new Date(tenant.trialEndsAt).getTime() - Date.now()) / 86400000)
    : null
  const isTrialing = trialDaysLeft !== null && trialDaysLeft > 0

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-xl font-bold">Paramètres</h1>

      {/* Infos société */}
      <div className="card-glass p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-blue-400" />
          <h2 className="font-semibold">Votre structure</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            ['Nom', tenant.nom],
            ['Type', tenant.typeStructure],
            ['Email', tenant.email],
            ['Téléphone', tenant.telephone ?? '—'],
            ['Ville', tenant.ville],
            ['Arrondissement', tenant.arrondissement ?? '—'],
            ['Agrément CIMA', tenant.agrementCima ?? 'Non renseigné'],
            ['Membre depuis', formatDate(tenant.createdAt)],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-gray-500 text-xs mb-0.5">{k}</p>
              <p className="text-white font-medium">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Abonnement */}
      <div className="card-glass p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-blue-400" />
          <h2 className="font-semibold">Abonnement SaaS</h2>
        </div>

        {isTrialing && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4 flex items-start gap-3">
            <Shield className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-400">Période d'essai — {trialDaysLeft} jours restants</p>
              <p className="text-xs text-gray-400 mt-0.5">Votre essai gratuit se termine le {formatDate(tenant.trialEndsAt!)}. Choisissez un forfait pour continuer.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400">Forfait actuel</p>
            <p className="text-lg font-bold text-blue-400">{planInfo.label}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Agents utilisés</p>
            <p className="font-bold">{tenant._count.agents} / {planInfo.agents === Infinity ? '∞' : planInfo.agents}</p>
          </div>
        </div>

        {/* Usage stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Contrats', val: tenant._count.contrats },
            { label: 'Prospects', val: tenant._count.prospects },
            { label: 'Agents', val: tenant._count.agents },
          ].map((s) => (
            <div key={s.label} className="bg-[#1a2235] rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-white">{s.val}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <Link href="/#tarifs" className="btn-primary w-full justify-center">
          Changer de forfait
        </Link>
        <p className="text-xs text-gray-500 text-center mt-2">Paiement MTN MoMo / Orange Money · Facturation mensuelle</p>
      </div>

      {/* Conformité CIMA */}
      <div className="card-glass p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h2 className="font-semibold">Conformité CIMA</h2>
        </div>
        <div className="space-y-2">
          {[
            'Numérotation polices conforme (POL-YYYY-XXXX)',
            'Numérotation sinistres conforme (SIN-YYYY-XXXX)',
            'Calcul taxes CIMA disponible',
            'Archivage sécurisé des contrats',
            'Traçabilité complète des modifications',
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
