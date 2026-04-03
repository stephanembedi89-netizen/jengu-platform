'use client';

import { create } from 'zustand';
import { LANG_KEY } from '@/lib/constants';
import type { Locale } from './config';

// ─── Store Zustand pour la langue ─────────────────────────

interface LangStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLangStore = create<LangStore>((set) => ({
  locale: (typeof window !== 'undefined'
    ? (localStorage.getItem(LANG_KEY) as Locale) || 'fr'
    : 'fr') as Locale,
  setLocale: (locale: Locale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_KEY, locale);
      document.cookie = `${LANG_KEY}=${locale};path=/;max-age=31536000`;
    }
    set({ locale });
  },
}));

// ─── Cache de messages (chargement statique) ─────────────

type Messages = Record<string, string>;

import frSync from './fr.json';
import enSync from './en.json';

function flattenMessages(obj: Record<string, unknown>, prefix = ''): Messages {
  const result: Messages = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') {
      result[key] = v;
    } else if (Array.isArray(v)) {
      // Ignorer les tableaux (non utilisés par le hook t())
    } else if (v && typeof v === 'object') {
      Object.assign(result, flattenMessages(v as Record<string, unknown>, key));
    }
  }
  return result;
}

// Les JSONs ont des clés plates (pas imbriquées), donc on les cast directement
// en filtrant les valeurs non-string
function toMessages(raw: Record<string, unknown>): Messages {
  const result: Messages = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === 'string') result[k] = v;
  }
  return result;
}

const messageCache: Record<Locale, Messages> = {
  fr: toMessages(frSync as Record<string, unknown>),
  en: toMessages(enSync as Record<string, unknown>),
};

// ─── Hook useT() ──────────────────────────────────────────

type TranslationValues = Record<string, string | number>;

/**
 * Hook de traduction client-side.
 */
export function useT() {
  const locale = useLangStore((s) => s.locale);
  const messages = messageCache[locale] || messageCache.fr;

  function t(key: string, values?: TranslationValues): string {
    let msg = messages[key] ?? messageCache.fr[key] ?? key;
    if (values) {
      Object.entries(values).forEach(([k, v]) => {
        msg = msg.replace(`{${k}}`, String(v));
      });
    }
    return msg;
  }

  return { t, locale };
}

/**
 * Traduction statique hors hook.
 */
export function translate(key: string, locale: Locale, values?: TranslationValues): string {
  const messages = messageCache[locale] || messageCache.fr;
  let msg = messages[key] ?? messageCache.fr[key] ?? key;
  if (values) {
    Object.entries(values).forEach(([k, v]) => {
      msg = msg.replace(`{${k}}`, String(v));
    });
  }
  return msg;
}
