'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { copierDansPressesPapier } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
}

export default function MessageBubble({
  role,
  content,
  isStreaming = false,
  copyLabel = 'Copier',
  copiedLabel = 'Copié !',
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copierDansPressesPapier(content);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end"
      >
        <div className="max-w-[80%] bg-blue-electric/15 border border-blue-electric/25 rounded-2xl rounded-tr-none px-4 py-3">
          <p className="text-sm font-body text-text-primary leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </motion.div>
    );
  }

  // Message assistant
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3"
    >
      {/* Avatar IA */}
      <div className="w-8 h-8 rounded-full bg-blue-electric/15 border border-blue-electric/25 flex items-center justify-center flex-shrink-0 mt-1">
        <span className="text-xs font-body font-700 text-blue-glow" aria-hidden="true">AI</span>
      </div>

      {/* Contenu */}
      <div className="flex-1 max-w-[85%]">
        <div className="bg-navy-card border border-navy-border rounded-2xl rounded-tl-none px-4 py-3">
          <p className={cn(
            'text-sm font-body text-text-primary leading-relaxed whitespace-pre-wrap',
            isStreaming && 'after:content-["▋"] after:ml-0.5 after:animate-pulse after:text-blue-electric'
          )}>
            {content}
          </p>
        </div>

        {/* Bouton copier (seulement si pas en streaming) */}
        {!isStreaming && content && (
          <button
            onClick={handleCopy}
            aria-label={copyLabel}
            className="mt-1.5 flex items-center gap-1 text-[11px] text-text-muted hover:text-blue-glow transition-colors font-body"
          >
            {copied ? (
              <><Check className="w-3 h-3" aria-hidden="true" /> {copiedLabel}</>
            ) : (
              <><Copy className="w-3 h-3" aria-hidden="true" /> {copyLabel}</>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}
