'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import MessageBubble from '@/components/modules/Chat/MessageBubble';
import TypingIndicator from '@/components/modules/Chat/TypingIndicator';
import SuggestedQuestions from '@/components/modules/Chat/SuggestedQuestions';
import Button from '@/components/ui/Button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AssistantPage() {
  const { t } = useT();
  const { locale } = useLangStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll automatique vers le bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, isLoading]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          lang: locale,
        }),
      });

      if (!response.ok) throw new Error('Erreur API');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Pas de stream');

      const decoder = new TextDecoder();
      let accumulated = '';

      setIsLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamingContent(accumulated);
      }

      // Ajouter le message complet
      setMessages(prev => [...prev, { role: 'assistant', content: accumulated }]);
      setStreamingContent('');
    } catch {
      setError(t('assistant.error'));
      setIsLoading(false);
      setStreamingContent('');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleReset() {
    setMessages([]);
    setStreamingContent('');
    setError('');
    inputRef.current?.focus();
  }

  const showSuggestions = messages.length === 0 && !isLoading;

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-80px)]">
      {/* En-tête chat */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            {t('assistant.title')}
          </h1>
          <p className="text-xs text-blue-glow font-body font-semibold mt-0.5">
            🏛️ FiscoAI · {t('assistant.subtitle')}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleReset}
            aria-label={t('assistant.reset')}
            title={t('assistant.reset')}
            className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger-bg transition-all"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Zone messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        {/* Message de bienvenue */}
        {messages.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MessageBubble
              role="assistant"
              content={t('assistant.welcome')}
              copyLabel={t('assistant.copy')}
              copiedLabel={t('calc.copied')}
            />
          </motion.div>
        )}

        {/* Questions suggérées */}
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4"
          >
            <SuggestedQuestions onSelect={sendMessage} locale={locale} />
          </motion.div>
        )}

        {/* Historique messages */}
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            copyLabel={t('assistant.copy')}
            copiedLabel={t('calc.copied')}
          />
        ))}

        {/* Indicateur de frappe */}
        {isLoading && <TypingIndicator />}

        {/* Message en streaming */}
        {streamingContent && (
          <MessageBubble
            role="assistant"
            content={streamingContent}
            isStreaming
            copyLabel={t('assistant.copy')}
            copiedLabel={t('calc.copied')}
          />
        )}

        {/* Erreur */}
        {error && (
          <div className="text-sm text-danger bg-danger-bg border border-danger/20 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Zone de saisie */}
      <div className="border-t border-navy-border pt-4">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('assistant.placeholder')}
            aria-label={t('assistant.placeholder')}
            disabled={isLoading}
            rows={1}
            className="input-field flex-1 resize-none min-h-[44px] max-h-32 py-3 leading-relaxed"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            loading={isLoading}
            size="md"
            aria-label={t('assistant.send')}
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('assistant.send')}</span>
          </Button>
        </div>

        {/* Disclaimer légal */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-[11px] text-text-muted">{t('assistant.disclaimer')}</p>
          <a
            href="https://www.impots.cm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-text-muted hover:text-blue-glow flex items-center gap-0.5 transition-colors"
          >
            impots.cm <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
