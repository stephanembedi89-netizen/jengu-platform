'use client'

import { useState } from 'react'
import { Plus, X, AlertTriangle } from 'lucide-react'
import { STATUT_SINISTRE_LABELS, TYPE_PRODUIT_LABELS, formatXAF, formatDate, cn } from '@/lib/utils'

const STATUT_BADGE: Record<string, string> = {
  DECLARE: 'badge-blue',
  EN_INSTRUCTION: 'badge-warning',
  EXPERTISE_EN_COURS: 'badge bg-purple-500/15 text-purple-400 border border-purple-500/30',
  INDEMNISE: 'badge-success',
  REJETE: 'badge-danger',
  CLOS: 'badge-muted',
}

const GRAVITE_BADGE: Record<string, string> = {
  FAIBLE: 'badge-success',
  MOYEN: 'badge-warning',
  ELEVE: 'badge-danger',
  CATASTROPHE: 'badge bg-red-700/30 text-red-300 border border-red-700/50',
}

const STATUTS_SINISTRE = Object.entries(STATUT_SINISTRE_LABELS)

type Sinistre = {
  id: string; numero: string; dateSinistre: Date; description: string; gravite: string;
  statut: string; montantDeclare: number | null; montantIndemnise: number | null;
  createdAt: Date;
  contrat: { numero: string; nomAssure: string; typeProduit: string }
  agent: { nom: string; prenom: string }
}

type Agent = { id: string; nom: string; prenom: string }
type Contrat = { id: string; numero: string; nomAssure: string }

function AddSinistreModal({ agents, contrats, onClose, onAdded }: { agents: Agent[]; contrats: Contrat[]; onClose: () => void; onAdded: (s: Sinistre) => void }) {
  const [form, setForm] = useState({
    contratId: contrats[0]?.id ?? '', agentId: agents[0]?.id ?? '',
    dateSinistre: new Date().toISOString().split('T')[0],
    lieuSinistre: '', description: '', gravite: 'MOYEN', montantDeclare: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch('/api/sinistres', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onAdded(data as Sinistre)
      onClose()
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Erreur') }
    finally { setLoading(false) }
  }

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Déclarer un sinistre</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm text-red-400">{error}</div>}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Contrat concerné *</label>
            <select value={form.contratId} onChange={(e) => set('contratId', e.target.value)} className="input-field" required>
              {contrats.length === 0 ? <option value="">Aucun contrat actif</option> : contrats.map((c) => <option key={c.id} value={c.id}>{c.numero} — {c.nomAssure}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Agent déclarant *</label>
              <select value={form.agentId} onChange={(e) => set('agentId', e.target.value)} className="input-field">
                {agents.map((a) => <option key={a.id} value={a.id}>{a.prenom} {a.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Date du sinistre *</label>
              <input type="date" value={form.dateSinistre} onChange={(e) => set('dateSinistre', e.target.value)} required className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Gravité *</label>
              <select value={form.gravite} onChange={(e) => set('gravite', e.target.value)} className="input-field">
                <option value="FAIBLE">Faible</option>
                <option value="MOYEN">Moyen</option>
                <option value="ELEVE">Élevé</option>
                <option value="CATASTROPHE">Catastrophe</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Montant déclaré (XAF)</label>
              <input type="number" value={form.montantDeclare} onChange={(e) => set('montantDeclare', e.target.value)} className="input-field" placeholder="Ex: 500 000" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Lieu du sinistre</label>
            <input value={form.lieuSinistre} onChange={(e) => set('lieuSinistre', e.target.value)} className="input-field" placeholder="Akwa, Douala..." />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Description *</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} required rows={3} className="input-field resize-none" placeholder="Décrivez les circonstances du sinistre..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Annuler</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Enregistrement...' : 'Déclarer'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function SinistresClient({ sinistres: initial, agents, contrats, role }: { sinistres: Sinistre[]; agents: Agent[]; contrats: Contrat[]; role: string }) {
  const [sinistres, setSinistres] = useState<Sinistre[]>(initial)
  const [filterStatut, setFilterStatut] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = sinistres.filter((s) => !filterStatut || s.statut === filterStatut)

  async function updateStatut(id: string, statut: string) {
    const res = await fetch(`/api/sinistres/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ statut }) })
    if (res.ok) setSinistres((prev) => prev.map((s) => s.id === id ? { ...s, statut } : s))
  }

  const ouverts = sinistres.filter((s) => !['INDEMNISE', 'REJETE', 'CLOS'].includes(s.statut)).length
  const totalDeclare = sinistres.reduce((acc, s) => acc + (s.montantDeclare ?? 0), 0)

  return (
    <div className="space-y-5">
      {showAdd && <AddSinistreModal agents={agents} contrats={contrats} onClose={() => setShowAdd(false)} onAdded={(s) => setSinistres((prev) => [s, ...prev])} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Sinistres</h1>
          <p className="text-sm text-gray-400">{ouverts} ouvert{ouverts > 1 ? 's' : ''} · {formatXAF(totalDeclare)} déclarés</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="w-4 h-4" /> Déclarer un sinistre</button>
      </div>

      {/* Filtres statut */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilterStatut('')} className={cn('badge cursor-pointer', !filterStatut ? 'badge-blue' : 'badge-muted')}>Tous ({sinistres.length})</button>
        {STATUTS_SINISTRE.map(([k, v]) => {
          const count = sinistres.filter((s) => s.statut === k).length
          if (!count) return null
          return (
            <button key={k} onClick={() => setFilterStatut(filterStatut === k ? '' : k)} className={cn('badge cursor-pointer', filterStatut === k ? STATUT_BADGE[k] : 'badge-muted')}>
              {v} ({count})
            </button>
          )
        })}
      </div>

      <div className="card-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>N° Sinistre</th>
                <th>Contrat / Assuré</th>
                <th>Produit</th>
                <th>Date sinistre</th>
                <th>Gravité</th>
                <th>Montant déclaré</th>
                <th>Agent</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-500">Aucun sinistre trouvé</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-mono text-sm text-amber-400">{s.numero}</span>
                    </div>
                  </td>
                  <td>
                    <p className="font-medium text-sm">{s.contrat.numero}</p>
                    <p className="text-xs text-gray-500">{s.contrat.nomAssure}</p>
                  </td>
                  <td className="text-sm text-gray-400">{TYPE_PRODUIT_LABELS[s.contrat.typeProduit] ?? s.contrat.typeProduit}</td>
                  <td className="text-sm">{formatDate(s.dateSinistre)}</td>
                  <td><span className={GRAVITE_BADGE[s.gravite] ?? 'badge-muted'}>{s.gravite}</span></td>
                  <td className="text-sm font-medium">{s.montantDeclare ? formatXAF(s.montantDeclare) : '—'}</td>
                  <td className="text-sm">{s.agent.prenom} {s.agent.nom}</td>
                  <td>
                    <select value={s.statut} onChange={(e) => updateStatut(s.id, e.target.value)} className={cn('text-xs px-2 py-1 rounded-full border bg-transparent cursor-pointer', STATUT_BADGE[s.statut])}>
                      {STATUTS_SINISTRE.map(([k, v]) => <option key={k} value={k} className="bg-[#111827] text-white">{v}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
