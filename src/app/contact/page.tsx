'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import AnimatedSection from '@/components/AnimatedSection'

type FormData = {
  name: string
  email: string
  company: string
  service: string
  budget: string
  message: string
}

type Errors = Partial<Record<keyof FormData, string>>

const serviceOptions = [
  { value: '',               label: 'Sélectionnez un service...' },
  { value: 'conseil',        label: 'Conseil stratégique en IA' },
  { value: 'automatisation', label: 'Automatisation intelligente' },
  { value: 'annotation',     label: 'Annotation de données' },
  { value: 'formation',      label: 'Formation IA' },
  { value: 'multi',          label: 'Plusieurs services' },
]

const budgetOptions = [
  { value: '',        label: 'Budget indicatif...' },
  { value: '<5k',     label: 'Moins de $5 000' },
  { value: '5k-20k',  label: '$5 000 — $20 000' },
  { value: '20k-50k', label: '$20 000 — $50 000' },
  { value: '50k+',    label: 'Plus de $50 000' },
  { value: 'discuss', label: 'À discuter' },
]

const contactInfo = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M2 4h16v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4z"/><path d="M2 4l8 7 8-7"/>
      </svg>
    ),
    label: 'Email',
    value: 'contact@jengu.ai',
    href: 'mailto:contact@jengu.ai',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1 3a1 1 0 01-.23 1.05L7.5 9.24A11.04 11.04 0 0010.76 12.5l1.51-1.5a1 1 0 011.05-.23l3 1a1 1 0 01.68.95V15a2 2 0 01-2 2A14 14 0 013 5z"/>
      </svg>
    ),
    label: 'Téléphone',
    value: '+237 672 705 729',
    href: 'tel:+237672705729',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M10 2C6.686 2 4 4.686 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.314-2.686-6-6-6z"/><circle cx="10" cy="8" r="2"/>
      </svg>
    ),
    label: 'Localisation',
    value: 'Douala, Cameroun',
    href: 'https://maps.google.com/?q=Douala,Cameroun',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="10" cy="10" r="8"/><path d="M2 10h16M10 2a14 14 0 010 16M10 2a14 14 0 000 16"/>
      </svg>
    ),
    label: 'Service',
    value: 'Remote · Afrique & International',
    href: '#',
  },
]

function validate(data: FormData): Errors {
  const errs: Errors = {}
  if (!data.name.trim())        errs.name    = 'Votre nom est requis'
  if (!data.email.trim())       errs.email   = 'Votre email est requis'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                                errs.email   = 'Email invalide'
  if (!data.service)            errs.service = 'Veuillez choisir un service'
  if (!data.message.trim())     errs.message = 'Un message est requis'
  else if (data.message.length < 20)
                                errs.message = 'Message trop court (min. 20 caractères)'
  return errs
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactPage() {
  const [form, setForm]     = useState<FormData>({ name: '', email: '', company: '', service: '', budget: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({})

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    if (touched[k]) {
      const next = { ...form, [k]: e.target.value }
      const errs = validate(next)
      setErrors(prev => ({ ...prev, [k]: errs[k] }))
    }
  }

  const blur = (k: keyof FormData) => () => {
    setTouched(t => ({ ...t, [k]: true }))
    const errs = validate(form)
    setErrors(prev => ({ ...prev, [k]: errs[k] }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, company: true, service: true, budget: true, message: true })
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setStatus('loading')
    /* ── Replace this block with your real API call / form service ──
       e.g. fetch('/api/contact', { method: 'POST', body: JSON.stringify(form) })
       or use Resend, Formspree, etc.                                             */
    await new Promise(r => setTimeout(r, 1400))
    setStatus('success')
    setForm({ name: '', email: '', company: '', service: '', budget: '', message: '' })
    setTouched({})
    setErrors({})
  }

  const field = (k: keyof FormData) => ({
    value: form[k],
    onChange: set(k),
    onBlur: blur(k),
  })

  return (
    <div className="pt-24">
      {/* ─── Hero ─── */}
      <section className="py-20 text-center relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 60%)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">Parlons-nous</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
              Démarrons votre<br />
              <span className="gradient-text">transformation IA</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-xl mx-auto">
              Premier échange gratuit et sans engagement. Réponse sous 24h ouvrées.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-10 items-start">

          {/* ─── Left column — info ─── */}
          <AnimatedSection direction="left" className="flex flex-col gap-6">
            {contactInfo.map(c => (
              <GlassCard key={c.label} hover={false} className="p-5">
                <a href={c.href} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-400"
                    style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-0.5">{c.label}</p>
                    <p className="text-slate-200 text-sm font-medium group-hover:text-blue-400 transition-colors">{c.value}</p>
                  </div>
                </a>
              </GlassCard>
            ))}

            {/* Availability */}
            <GlassCard hover={false} className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-sm font-semibold">Disponible actuellement</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Nous prenons de nouveaux projets. Réponse garantie sous <strong className="text-white">24h ouvrées</strong>.
              </p>
            </GlassCard>

            {/* Trust badges */}
            <GlassCard hover={false} className="p-5">
              <p className="text-white font-semibold text-sm mb-4">Ils nous font confiance</p>
              <div className="flex flex-wrap gap-2">
                {['Startups', 'PME', 'Grands groupes', 'ONG'].map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#93c5fd' }}>
                    {t}
                  </span>
                ))}
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* ─── Right — form ─── */}
          <AnimatedSection direction="right" className="lg:col-span-2">
            <GlassCard hover={false} className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                      style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <path d="M8 18l7 7L28 11" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-white font-bold text-2xl mb-3">Message envoyé !</h3>
                    <p className="text-slate-400 mb-8">
                      Merci <strong className="text-white">{form.name || 'pour votre message'}</strong>.<br/>
                      Notre équipe vous répondra sous 24h ouvrées.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="btn-secondary px-8 py-3 text-sm"
                    >
                      Envoyer un autre message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} noValidate className="flex flex-col gap-5">
                    <h2 className="text-white font-bold text-xl mb-2">Décrivez votre projet</h2>

                    {/* Row 1 */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-slate-400 text-sm mb-1.5">
                          Nom complet <span className="text-blue-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Jean Dupont"
                          className="form-input"
                          {...field('name')}
                        />
                        {errors.name && touched.name && (
                          <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-1.5">
                          Email professionnel <span className="text-blue-400">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="jean@entreprise.com"
                          className="form-input"
                          {...field('email')}
                        />
                        {errors.email && touched.email && (
                          <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-slate-400 text-sm mb-1.5">Entreprise</label>
                        <input
                          type="text"
                          placeholder="Nom de votre entreprise"
                          className="form-input"
                          {...field('company')}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-1.5">
                          Service concerné <span className="text-blue-400">*</span>
                        </label>
                        <select className="form-input" {...field('service')}>
                          {serviceOptions.map(o => (
                            <option key={o.value} value={o.value} disabled={o.value === ''}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        {errors.service && touched.service && (
                          <p className="text-red-400 text-xs mt-1.5">{errors.service}</p>
                        )}
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-slate-400 text-sm mb-1.5">Budget indicatif (USD)</label>
                      <select className="form-input" {...field('budget')}>
                        {budgetOptions.map(o => (
                          <option key={o.value} value={o.value} disabled={o.value === ''}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-slate-400 text-sm mb-1.5">
                        Décrivez votre projet <span className="text-blue-400">*</span>
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Décrivez votre contexte, vos objectifs, vos contraintes..."
                        className="form-input resize-none"
                        {...field('message')}
                      />
                      <div className="flex items-center justify-between mt-1.5">
                        {errors.message && touched.message
                          ? <p className="text-red-400 text-xs">{errors.message}</p>
                          : <span />
                        }
                        <span className="text-slate-600 text-xs">{form.message.length} / 500</span>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary py-4 text-base font-bold rounded-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                      {status === 'loading' ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          Envoyer ma demande
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M1 8h14M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="text-slate-600 text-xs text-center">
                      En soumettant ce formulaire, vous acceptez notre{' '}
                      <a href="#" className="text-blue-500 hover:underline">politique de confidentialité</a>.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
