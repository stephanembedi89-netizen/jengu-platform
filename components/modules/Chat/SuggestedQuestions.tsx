'use client';

import { motion } from 'framer-motion';
import { SUGGESTED_QUESTIONS_FR, SUGGESTED_QUESTIONS_EN } from '@/lib/ai-prompts';
import { useT } from '@/lib/i18n/useTranslation';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  locale: 'fr' | 'en';
}

export default function SuggestedQuestions({ onSelect, locale }: SuggestedQuestionsProps) {
  const { t } = useT();
  const questions = locale === 'en' ? SUGGESTED_QUESTIONS_EN : SUGGESTED_QUESTIONS_FR;

  return (
    <div>
      <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider mb-3">
        {t('assistant.suggestions_title')}
      </p>
      <div className="flex flex-wrap gap-2">
        {questions.map((q, i) => (
          <motion.button
            key={q}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(q)}
            className="px-3 py-1.5 rounded-full text-xs font-body text-text-secondary bg-navy-card border border-navy-border hover:border-blue-electric/40 hover:text-blue-glow hover:bg-blue-electric/8 transition-all duration-150"
          >
            {q}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
