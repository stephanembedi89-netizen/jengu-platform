// ============================================================
// CONSTANTES GLOBALES — Fisco.IA
// ============================================================

export const APP_NAME = 'Fisco.IA';
export const COMPANY_NAME = 'Jengu.AI';
export const COMPANY_URL = 'https://jengu.ai';
export const COMPANY_LOCATION = 'Douala, Cameroun';
export const COMPANY_EMAIL = 'contact@jengu.ai';

// Portail fiscal officiel camerounais
export const IMPOTS_CM_URL = 'https://www.impots.cm';

// ONECCA — Ordre National des Experts Comptables du Cameroun
export const ONECCA_URL = 'https://www.onecca.cm';

// Clé localStorage pour le disclaimer
export const DISCLAIMER_KEY = 'fiscoai_disclaimer_seen';

// Clé localStorage/cookie pour la langue
export const LANG_KEY = 'fiscoai_lang';

// LF 2026
export const LF_2026 = {
  numero: 'Loi n° 2025/012',
  date: '17 décembre 2025',
  label_fr: 'Loi de Finances 2026',
  label_en: 'Finance Law 2026',
};

// Navigation items
export const NAV_ITEMS = [
  { key: 'dashboard',    path: '/dashboard',    icon: 'LayoutDashboard', label_fr: 'Tableau de bord', label_en: 'Dashboard' },
  { key: 'calculateur',  path: '/calculateur',  icon: 'Calculator',      label_fr: 'Calculateur IGS',  label_en: 'IGS Calculator' },
  { key: 'calendrier',   path: '/calendrier',   icon: 'Calendar',        label_fr: 'Calendrier',       label_en: 'Calendar' },
  { key: 'assistant',    path: '/assistant',    icon: 'MessageCircle',   label_fr: 'Assistant IA',     label_en: 'AI Assistant' },
  { key: 'faq',          path: '/faq',          icon: 'HelpCircle',      label_fr: 'FAQ',              label_en: 'FAQ' },
  { key: 'legal',        path: '/legal',        icon: 'Scale',           label_fr: 'Cadre Légal',      label_en: 'Legal Framework' },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]['key'];

// Tarifs (FCFA) — Van Westendorp · Avril 2026
// annuel = 10 mois (économie 2 mois = −17%)
export const TARIFS = {
  free: {
    prix_mensuel: 0,
    prix_annuel: 0,
    label_fr: 'Free',
    label_en: 'Free',
  },
  solo: {
    prix_mensuel: 4_900,
    prix_annuel: 49_000,
    label_fr: 'Solo',
    label_en: 'Solo',
  },
  pro: {
    prix_mensuel: 9_900,
    prix_annuel: 99_000,
    label_fr: 'Pro',
    label_en: 'Pro',
    populaire: true,
  },
  cabinet: {
    prix_mensuel: 24_900,
    prix_annuel: 249_000,
    label_fr: 'Cabinet',
    label_en: 'Cabinet',
  },
};
