'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Phone, User, ChevronDown, X } from 'lucide-react'
import { STATUT_PROSPECT_LABELS, TYPE_PRODUIT_LABELS, ARRONDISSEMENTS_DOUALA, formatDate, cn } from '@/lib/utils'

const STATUTS = Object.entries(STATUT_PROSPECT_LABELS)
const PRODUITS = Object.entries(TYPE_PRODUIT_LABELS)

const STATUT_BADGE: Record<string, string> = {
  NOUVEAU: 'badge-muted',
  CONTACTE: 'badge-blue',
  INTERESSE: 'badge bg-purple-500/15 text-purple-400 border border-purple-500/30',
  DEVIS_ENVOYE: 'badge-warning',
  RELANCE: 'badge bg-orange-500/15 text-orange-400 border border-orange-500/30',
  CONVERTI: 'badge-success',
  PERDU: 'badge-danger',
}

type Agent = { id: string; nom: string; prenom: string; zone: string | null }
type Prospect = {
  id: string; nom: string; prenom: string | null; telephone: string; statut: string;
  produitInteret: string | null; arrondissement: string | null; createdAt: Date;
  agent: { nom: string; prenom: string }
}

interface Props {
  agents: Agent[]
  initialProspects: Prospect[]
  role: string
}

function AddProspectModal({ agents, onClose, onAdded }: { agents: Agent[]; onClose: () => void; onAdded: (p: Prospect) => void }) {
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', agentId: agents[0]?.id ?? '', produitInteret: '', arrondissement: ARRONDISSEMENTS_DOUALA[0], noteInterne: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/prospects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onAdded(data)
      onClose()
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Erreur') }
    finally { setLoading(false) }
  }

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Nouveau prospect</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm text-red-400">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-400 mb-1">Nom *</label><input value={form.nom} onChange={(e) => set('nom', e.target.value)} required className="input-field" placeholder="Mballa" /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Prénom</label><input value={form.prenom} onChange={(e) => set('prenom', e.target.value)} className="input-field" placeholder="Jean" /></div>
          </div>
          <div><label className="block text-xs text-gray-400 mb-1">Téléphone *</label><input value={form.telephone} onChange={(e) => set('telephone', e.target.value)} required className="input-field" placeholder="+237 6XX XXX XXX" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Agent *</label>
              <select value={form.agentId} onChange={(e) => set('agentId', e.target.value)} className="input-field">
                {agents.map((a) => <option key={a.id} value={a.id}>{a.prenom} {a.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Produit souhaité</label>
              <select value={form.produitInteret} onChange={(e) => set('produitInteret', e.target.value)} className="input-field">
                <option value="">— Non défini —</option>
                {PRODUITS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Arrondissement</label>
            <select value={form.arrondissement} onChange={(e) => set('arrondissement', e.target.value)} className="input-field">
              {ARRONDISSEMENTS_DOUALA.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div><label className="block text-xs text-gray-400 mb-1">Note interne</label><textarea value={form.noteInterne} onChange={(e) => set('noteInterne', e.target.value)} rows={2} className="input-field resize-none" placeholder="Informations complémentaires..." /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Annuler</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Enregistrement...' : 'Ajouter'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ProspectsClient({ agents, initialProspects, role }: Props) {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects)
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = prospects.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.nom.toLowerCase().includes(q) || (p.prenom ?? '').toLowerCase().includes(q) || p.telephone.includes(q)
    const matchStatut = !filterStatut || p.statut === filterStatut
    return matchSearch && matchStatut
  })

  async function updateStatut(id: string, statut: string) {
    const res = await fetch(`/api/prospects/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ statut }) })
    if (res.ok) setProspects((prev) => prev.map((p) => p.id === id ? { ...p, statut } : p))
  }

  return (
    <div className="space-y-5">
      {showAdd && <AddProspectModal agents={agents} onClose={() => setShowAdd(false)} onAdded={(p) => setProspects((prev) => [p as unknown as Prospect, ...prev])} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Prospects</h1>
          <p className="text-sm text-gray-400">{filtered.length} prospect{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="w-4 h-4" /> Nouveau prospect</button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="input-field pl-9" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="input-field pl-9 pr-8 appearance-none">
            <option value="">Tous les statuts</option>
            {STATUTS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="card-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Prospect</th>
                <th>Téléphone</th>
                <th>Produit</th>
                <th>Zone</th>
                <th>Agent</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500">Aucun prospect trouvé</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1a2235] flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{p.nom} {p.prenom ?? ''}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <a href={`tel:${p.telephone}`} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm">
                      <Phone className="w-3 h-3" /> {p.telephone}
                    </a>
                  </td>
                  <td className="text-sm text-gray-400">{p.produitInteret ? TYPE_PRODUIT_LABELS[p.produitInteret] : '—'}</td>
                  <td className="text-sm text-gray-400">{p.arrondissement ?? '—'}</td>
                  <td className="text-sm">{p.agent.prenom} {p.agent.nom}</td>
                  <td>
                    <select
                      value={p.statut}
                      onChange={(e) => updateStatut(p.id, e.target.value)}
                      className={cn('text-xs px-2 py-1 rounded-full border bg-transparent cursor-pointer', STATUT_BADGE[p.statut])}
                    >
                      {STATUTS.map(([k, v]) => <option key={k} value={k} className="bg-[#111827] text-white">{v}</option>)}
                    </select>
                  </td>
                  <td className="text-xs text-gray-500">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
