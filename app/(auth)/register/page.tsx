'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Loader2, ChevronDown } from 'lucide-react'
import { ARRONDISSEMENTS_DOUALA } from '@/lib/utils'

const STRUCTURE_TYPES = [
  { value: 'COURTIER', label: 'Courtier en assurances' },
  { value: 'COMPAGNIE', label: "Compagnie d'assurance" },
  { value: 'AGENT_GENERAL', label: 'Agent général' },
  { value: 'MANDATAIRE', label: 'Mandataire exclusif' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nomSociete: '',
    typeStructure: 'COURTIER',
    arrondissement: 'Douala I (Wouri)',
    email: '',
    telephone: '',
    nom: '',
    prenom: '',
    password: '',
  })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'inscription")
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Jengu<span className="text-blue-400">Assur</span></span>
          </Link>
          <h1 className="text-2xl font-bold">Créer votre espace</h1>
          <p className="text-gray-400 text-sm mt-1">14 jours gratuits · Sans carte bancaire</p>
        </div>

        <form onSubmit={handleSubmit} className="card-glass p-8 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Votre structure</p>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nom de la structure *</label>
            <input value={form.nomSociete} onChange={(e) => set('nomSociete', e.target.value)}
              placeholder="Ex: Chanas Assurances, Cabinet XYZ..." required className="input-field" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Type de structure *</label>
              <div className="relative">
                <select value={form.typeStructure} onChange={(e) => set('typeStructure', e.target.value)}
                  className="input-field appearance-none pr-8">
                  {STRUCTURE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Arrondissement *</label>
              <div className="relative">
                <select value={form.arrondissement} onChange={(e) => set('arrondissement', e.target.value)}
                  className="input-field appearance-none pr-8">
                  {ARRONDISSEMENTS_DOUALA.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Téléphone *</label>
              <input value={form.telephone} onChange={(e) => set('telephone', e.target.value)}
                placeholder="+237 6XX XXX XXX" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email société *</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                placeholder="contact@societe.cm" required className="input-field" />
            </div>
          </div>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Votre compte administrateur</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Prénom *</label>
              <input value={form.prenom} onChange={(e) => set('prenom', e.target.value)}
                placeholder="Jean" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Nom *</label>
              <input value={form.nom} onChange={(e) => set('nom', e.target.value)}
                placeholder="Mballa" required className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Mot de passe *</label>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)}
              placeholder="8 caractères minimum" required minLength={8} className="input-field" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Création...</> : 'Créer mon espace gratuit'}
          </button>

          <p className="text-center text-xs text-gray-500">
            En créant un compte, vous acceptez nos{' '}
            <a href="#" className="text-blue-400 hover:underline">CGU</a> et{' '}
            <a href="#" className="text-blue-400 hover:underline">Politique de confidentialité</a>
          </p>

          <p className="text-center text-sm text-gray-500">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
