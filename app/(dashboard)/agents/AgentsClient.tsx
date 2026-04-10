'use client'

import { useState } from 'react'
import { Plus, X, Users, TrendingUp, Target } from 'lucide-react'
import { formatXAF, ARRONDISSEMENTS_DOUALA, cn } from '@/lib/utils'

type Agent = {
  id: string; nom: string; prenom: string; telephone: string; email: string | null;
  zone: string | null; tauxCommission: number; objectifMensuel: number | null; isActif: boolean;
  _count: { contrats: number; prospects: number }
  caThisMth: number; commissionThisMth: number
}

function AddAgentModal({ onClose, onAdded }: { onClose: () => void; onAdded: (a: Agent) => void }) {
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', email: '', zone: ARRONDISSEMENTS_DOUALA[0], objectifMensuel: '', tauxCommission: '10' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/agents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onAdded({ ...data, _count: { contrats: 0, prospects: 0 }, caThisMth: 0, commissionThisMth: 0 })
      onClose()
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Erreur') }
    finally { setLoading(false) }
  }

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Nouvel agent</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm text-red-400">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-400 mb-1">Nom *</label><input value={form.nom} onChange={(e) => set('nom', e.target.value)} required className="input-field" /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Prénom</label><input value={form.prenom} onChange={(e) => set('prenom', e.target.value)} className="input-field" /></div>
          </div>
          <div><label className="block text-xs text-gray-400 mb-1">Téléphone *</label><input value={form.telephone} onChange={(e) => set('telephone', e.target.value)} required className="input-field" placeholder="+237 6XX XXX XXX" /></div>
          <div><label className="block text-xs text-gray-400 mb-1">Email</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="input-field" /></div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Zone / Arrondissement</label>
            <select value={form.zone} onChange={(e) => set('zone', e.target.value)} className="input-field">
              {ARRONDISSEMENTS_DOUALA.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-400 mb-1">Objectif mensuel (XAF)</label><input type="number" value={form.objectifMensuel} onChange={(e) => set('objectifMensuel', e.target.value)} className="input-field" placeholder="500 000" /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Commission (%)</label><input type="number" value={form.tauxCommission} onChange={(e) => set('tauxCommission', e.target.value)} min="0" max="50" className="input-field" /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Annuler</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Enregistrement...' : 'Ajouter'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AgentsClient({ agents: initialAgents }: { agents: Agent[] }) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [showAdd, setShowAdd] = useState(false)

  const totalCA = agents.reduce((acc, a) => acc + a.caThisMth, 0)
  const totalCommissions = agents.reduce((acc, a) => acc + a.commissionThisMth, 0)

  return (
    <div className="space-y-5">
      {showAdd && <AddAgentModal onClose={() => setShowAdd(false)} onAdded={(a) => setAgents((prev) => [...prev, a])} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Agents commerciaux</h1>
          <p className="text-sm text-gray-400">{agents.filter((a) => a.isActif).length} agents actifs</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="w-4 h-4" /> Nouvel agent</button>
      </div>

      {/* Résumé KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Agents actifs', value: agents.filter((a) => a.isActif).length, icon: Users, color: 'text-blue-400' },
          { label: 'CA équipe ce mois', value: formatXAF(totalCA), icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Commissions à verser', value: formatXAF(totalCommissions), icon: Target, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="stat-card border-l-2 border-l-[#1f2937]">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">{s.label}</p>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Grille agents */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.length === 0 ? (
          <div className="col-span-3 card-glass p-12 text-center text-gray-500">Aucun agent enregistré</div>
        ) : agents.map((agent) => {
          const progression = agent.objectifMensuel ? Math.min(100, Math.round((agent.caThisMth / agent.objectifMensuel) * 100)) : null
          return (
            <div key={agent.id} className={cn('card-glass p-5 space-y-4', !agent.isActif && 'opacity-50')}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-sm font-bold text-blue-400">
                  {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{agent.prenom} {agent.nom}</p>
                  <p className="text-xs text-gray-500">{agent.zone ?? 'Douala'}</p>
                </div>
                <span className={agent.isActif ? 'badge-success' : 'badge-muted'}>{agent.isActif ? 'Actif' : 'Inactif'}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-[#1a2235] rounded-lg p-2.5">
                  <p className="text-xs text-gray-500 mb-1">Contrats</p>
                  <p className="font-bold text-white">{agent._count.contrats}</p>
                </div>
                <div className="bg-[#1a2235] rounded-lg p-2.5">
                  <p className="text-xs text-gray-500 mb-1">Prospects</p>
                  <p className="font-bold text-white">{agent._count.prospects}</p>
                </div>
                <div className="bg-[#1a2235] rounded-lg p-2.5">
                  <p className="text-xs text-gray-500 mb-1">CA ce mois</p>
                  <p className="font-bold text-emerald-400">{formatXAF(agent.caThisMth)}</p>
                </div>
                <div className="bg-[#1a2235] rounded-lg p-2.5">
                  <p className="text-xs text-gray-500 mb-1">Commission</p>
                  <p className="font-bold text-amber-400">{formatXAF(agent.commissionThisMth)}</p>
                </div>
              </div>

              {progression !== null && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Objectif mensuel</span>
                    <span>{progression}%</span>
                  </div>
                  <div className="w-full bg-[#1a2235] rounded-full h-1.5">
                    <div className={cn('h-1.5 rounded-full transition-all', progression >= 100 ? 'bg-emerald-500' : progression >= 60 ? 'bg-blue-500' : 'bg-amber-500')}
                      style={{ width: `${progression}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Obj: {formatXAF(agent.objectifMensuel ?? 0)}</p>
                </div>
              )}

              <p className="text-xs text-gray-500">Tél: {agent.telephone} · Commission: {agent.tauxCommission}%</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
