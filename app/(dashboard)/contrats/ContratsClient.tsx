'use client'

import { useState } from 'react'
import { Plus, Search, FileText, Phone, X, ChevronDown, AlertCircle } from 'lucide-react'
import { STATUT_CONTRAT_LABELS, TYPE_PRODUIT_LABELS, formatXAF, formatDate, daysUntil, cn } from '@/lib/utils'

const STATUT_BADGE: Record<string, string> = {
  ACTIF: 'badge-success',
  SUSPENDU: 'badge-warning',
  EN_ATTENTE_PAIEMENT: 'badge-warning',
  RESILIE: 'badge-danger',
  EXPIRE: 'badge-muted',
  RENOUVELE: 'badge-blue',
}

const STATUTS = Object.entries(STATUT_CONTRAT_LABELS)
const PRODUITS = Object.entries(TYPE_PRODUIT_LABELS)

type Agent = { id: string; nom: string; prenom: string }
type Contrat = {
  id: string; numero: string; nomAssure: string; prenomAssure: string | null;
  telephoneAssure: string; typeProduit: string; primeAnnuelle: number; statut: string;
  dateEffet: Date; dateEcheance: Date; createdAt: Date;
  agent: { nom: string; prenom: string }; produit: { nom: string } | null
}

function AddContratModal({ agents, onClose, onAdded }: { agents: Agent[]; onClose: () => void; onAdded: (c: Contrat) => void }) {
  const [form, setForm] = useState({
    nomAssure: '', prenomAssure: '', telephoneAssure: '', emailAssure: '',
    agentId: agents[0]?.id ?? '', typeProduit: 'AUTO',
    primeAnnuelle: '', dateEffet: new Date().toISOString().split('T')[0],
    dateEcheance: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    renouvAuto: true, notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/contrats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onAdded(data as Contrat)
      onClose()
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Erreur') }
    finally { setLoading(false) }
  }

  function set(k: string, v: string | boolean) { setForm((f) => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Nouveau contrat</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm text-red-400">{error}</div>}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Assuré</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-400 mb-1">Nom *</label><input value={form.nomAssure} onChange={(e) => set('nomAssure', e.target.value)} required className="input-field" /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Prénom</label><input value={form.prenomAssure} onChange={(e) => set('prenomAssure', e.target.value)} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-400 mb-1">Téléphone *</label><input value={form.telephoneAssure} onChange={(e) => set('telephoneAssure', e.target.value)} required className="input-field" placeholder="+237 6XX XXX XXX" /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Email</label><input type="email" value={form.emailAssure} onChange={(e) => set('emailAssure', e.target.value)} className="input-field" /></div>
          </div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-1">Contrat</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Agent *</label>
              <select value={form.agentId} onChange={(e) => set('agentId', e.target.value)} className="input-field">
                {agents.map((a) => <option key={a.id} value={a.id}>{a.prenom} {a.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Type de produit *</label>
              <select value={form.typeProduit} onChange={(e) => set('typeProduit', e.target.value)} className="input-field">
                {PRODUITS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div><label className="block text-xs text-gray-400 mb-1">Prime annuelle (XAF) *</label><input type="number" value={form.primeAnnuelle} onChange={(e) => set('primeAnnuelle', e.target.value)} required min="0" className="input-field" placeholder="150 000" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-400 mb-1">Date d'effet *</label><input type="date" value={form.dateEffet} onChange={(e) => set('dateEffet', e.target.value)} required className="input-field" /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Date d'échéance *</label><input type="date" value={form.dateEcheance} onChange={(e) => set('dateEcheance', e.target.value)} required className="input-field" /></div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="renouvAuto" checked={form.renouvAuto} onChange={(e) => set('renouvAuto', e.target.checked)} className="rounded" />
            <label htmlFor="renouvAuto" className="text-sm text-gray-300">Renouvellement automatique</label>
          </div>
          <div><label className="block text-xs text-gray-400 mb-1">Notes</label><textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} className="input-field resize-none" /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Annuler</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Enregistrement...' : 'Créer le contrat'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ContratsClient({ agents, initialContrats, role }: { agents: Agent[]; initialContrats: Contrat[]; role: string }) {
  const [contrats, setContrats] = useState<Contrat[]>(initialContrats)
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = contrats.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch = !q || c.nomAssure.toLowerCase().includes(q) || c.numero.toLowerCase().includes(q) || c.telephoneAssure.includes(q)
    const matchStatut = !filterStatut || c.statut === filterStatut
    return matchSearch && matchStatut
  })

  const totalCA = filtered.reduce((acc, c) => acc + c.primeAnnuelle, 0)

  return (
    <div className="space-y-5">
      {showAdd && <AddContratModal agents={agents} onClose={() => setShowAdd(false)} onAdded={(c) => setContrats((prev) => [c, ...prev])} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Contrats</h1>
          <p className="text-sm text-gray-400">{filtered.length} contrat{filtered.length > 1 ? 's' : ''} · CA: {formatXAF(totalCA)}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="w-4 h-4" /> Nouveau contrat</button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Numéro, assuré, téléphone..." className="input-field pl-9" />
        </div>
        <div className="relative">
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="input-field pr-8 appearance-none">
            <option value="">Tous les statuts</option>
            {STATUTS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="card-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>N° Police</th>
                <th>Assuré</th>
                <th>Produit</th>
                <th>Prime annuelle</th>
                <th>Agent</th>
                <th>Échéance</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500">Aucun contrat trouvé</td></tr>
              ) : filtered.map((c) => {
                const jours = daysUntil(c.dateEcheance)
                const echeanceProche = c.statut === 'ACTIF' && jours <= 30 && jours > 0
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="font-mono text-sm text-blue-400">{c.numero}</span>
                      </div>
                    </td>
                    <td>
                      <p className="font-medium">{c.nomAssure} {c.prenomAssure ?? ''}</p>
                      <a href={`tel:${c.telephoneAssure}`} className="text-xs text-blue-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {c.telephoneAssure}
                      </a>
                    </td>
                    <td className="text-sm text-gray-300">{TYPE_PRODUIT_LABELS[c.typeProduit] ?? c.typeProduit}</td>
                    <td className="font-semibold text-emerald-400">{formatXAF(c.primeAnnuelle)}</td>
                    <td className="text-sm">{c.agent.prenom} {c.agent.nom}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {echeanceProche && <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        <div>
                          <p className={cn('text-sm', echeanceProche ? 'text-amber-400 font-medium' : 'text-gray-300')}>{formatDate(c.dateEcheance)}</p>
                          {echeanceProche && <p className="text-xs text-amber-400">J-{jours}</p>}
                        </div>
                      </div>
                    </td>
                    <td><span className={STATUT_BADGE[c.statut] ?? 'badge-muted'}>{STATUT_CONTRAT_LABELS[c.statut]}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
