'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  "Rédige un devis pour une assurance auto Toyota Corolla 2020 à Douala I",
  "Quelles sont les garanties minimales CIMA pour l'assurance auto ?",
  "Comment relancer un prospect qui n'a pas donné suite à un devis ?",
  "Explique la différence entre assurance vie entière et temporaire",
  "Quels arguments pour convaincre une PME de souscrire une RC Pro ?",
  "Comment calculer la prime d'une assurance habitation à Akwa ?",
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  async function sendMessage(text?: string) {
    const msg = text ?? input.trim()
    if (!msg || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setStreaming('')

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Erreur API')
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const { text } = JSON.parse(data)
                fullText += text
                setStreaming(fullText)
              } catch {
                // Skip malformed SSE lines
              }
            }
          }
        }
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: fullText }])
      setStreaming('')
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Une erreur est survenue'
      setMessages((prev) => [...prev, { role: 'assistant', content: `❌ ${errMsg}` }])
      setStreaming('')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">AgentPulse AI</h1>
          <p className="text-sm text-gray-400">Assistant IA spécialisé assurance Cameroun · Claude Opus 4.6</p>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="ml-auto btn-secondary text-xs py-1.5 px-3">
            <X className="w-3 h-3" /> Nouvelle conversation
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 && !streaming && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Bonjour ! Je suis AgentPulse AI</h2>
            <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">
              Votre assistant spécialisé en assurance au Cameroun. Je peux vous aider à rédiger des devis, analyser des prospects, répondre aux questions CIMA et bien plus.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto text-left">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="card-glass p-3 text-sm text-gray-300 hover:text-white hover:border-blue-500/50 transition-colors text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold',
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#1f2937] text-blue-400'
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={cn(
              'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-[#111827] border border-[#1f2937] text-gray-200 rounded-tl-none'
            )}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {/* Streaming response */}
        {streaming && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1f2937] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="max-w-[80%] bg-[#111827] border border-[#1f2937] rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-200 leading-relaxed">
              <div className="whitespace-pre-wrap">{streaming}</div>
              <span className="inline-block w-1.5 h-4 bg-blue-400 ml-0.5 animate-pulse rounded-sm" />
            </div>
          </div>
        )}

        {loading && !streaming && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1f2937] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl rounded-tl-none px-4 py-3">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 card-glass p-3">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question sur l'assurance... (Entrée pour envoyer)"
            rows={2}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 resize-none outline-none"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="btn-primary h-10 w-10 p-0 justify-center shrink-0 self-end"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1.5">AgentPulse AI est alimenté par Claude Opus 4.6 · Réponses à titre indicatif, vérifiez la réglementation CIMA en vigueur</p>
      </div>
    </div>
  )
}
