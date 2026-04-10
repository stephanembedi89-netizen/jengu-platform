'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur de connexion')
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Jengu<span className="text-blue-400">Assur</span></span>
          </Link>
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-gray-400 text-sm mt-1">Accédez à votre espace de gestion</p>
        </div>

        <form onSubmit={handleSubmit} className="card-glass p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@compagnie.cm"
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Mot de passe</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">
              Mot de passe oublié ?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Connexion...</> : 'Se connecter'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Essai gratuit 14 jours
            </Link>
          </p>
        </form>

        {/* Demo account hint */}
        <div className="mt-4 card-glass p-4 text-center">
          <p className="text-xs text-gray-500 mb-2">Compte démo disponible :</p>
          <button
            onClick={() => { setEmail('demo@jenguassur.cm'); setPassword('Demo1234!') }}
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            demo@jenguassur.cm / Demo1234!
          </button>
        </div>
      </div>
    </div>
  )
}
