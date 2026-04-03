// ============================================================
// UTILITAIRES FISCO.IA
// ============================================================

import {
  IGS_BAREME,
  IGS_SEUIL_CA,
  CAC_TAUX,
  ABATTEMENT_RURAL,
  ABATTEMENT_CGA,
  type Secteur,
  type Zone,
  type IGSResult,
  type Echeance,
} from './fiscal-data-2026';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ─── Utilitaire CSS ───────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Formatage FCFA ──────────────────────────────────────

/** Formate un montant en FCFA avec séparateur de milliers */
export function formatFCFA(montant: number, opts?: { short?: boolean }): string {
  if (opts?.short) {
    if (montant >= 1_000_000) {
      return `${(montant / 1_000_000).toFixed(1).replace('.0', '')}M FCFA`;
    }
    if (montant >= 1_000) {
      return `${(montant / 1_000).toFixed(0)}K FCFA`;
    }
  }
  return new Intl.NumberFormat('fr-CM', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(montant)) + ' FCFA';
}

/** Formate un nombre avec séparateur de milliers (sans unité) */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('fr-CM').format(Math.round(n));
}

// ─── Calcul IGS ──────────────────────────────────────────

/**
 * Calcule l'IGS 2026 selon les paramètres fournis.
 * Art. C38-C44 CGI — LF 2026.
 *
 * @param ca - Chiffre d'affaires annuel HT en FCFA
 * @param secteur - Secteur d'activité
 * @param zone - Zone géographique (urbain | rural)
 * @param membreCGA - Membre d'un Centre de Gestion Agréé
 */
export function calculerIGS(params: {
  ca: number;
  secteur: Secteur;
  zone: Zone;
  membreCGA: boolean;
}): IGSResult | null {
  const { ca, secteur, zone, membreCGA } = params;

  // Vérification du seuil IGS
  if (ca >= IGS_SEUIL_CA) return null;
  if (ca <= 0) return null;

  // Trouver la tranche applicable
  const tranches = IGS_BAREME[secteur];
  const tranche = tranches.find(t => ca >= t.min && ca < t.max);
  if (!tranche) return null;

  // Calcul de la base IGS
  let base = (ca * tranche.taux) / 100;

  // Abattement zone rurale (30%)
  const abattementRural = zone === 'rural' ? base * ABATTEMENT_RURAL : 0;
  base = base - abattementRural;

  // Majoration CAC (10% sur base après abattement rural)
  const cac = base * CAC_TAUX;

  // Sous-total
  const sousTotal = base + cac;

  // Abattement CGA (50% sur sous-total — Art. C37 CGI LF 2026)
  const abattementCGA = membreCGA ? sousTotal * ABATTEMENT_CGA : 0;

  // Total final
  const totalAnnuel = sousTotal - abattementCGA;

  // Libellé de la tranche
  const trancheLabel = `${formatFCFA(tranche.min, { short: true })} – ${formatFCFA(tranche.max, { short: true })}`;

  return {
    base,
    cac,
    sousTotal,
    abattementRural,
    abattementCGA,
    totalAnnuel: Math.round(totalAnnuel),
    parTrimestre: Math.round(totalAnnuel / 4),
    parMois: Math.round(totalAnnuel / 12),
    taux: tranche.taux,
    tranche: trancheLabel,
  };
}

// ─── Calcul jours restants ────────────────────────────────

/** Retourne le nombre de jours restants avant une date */
export function joursRestants(dateISO: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateISO);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Retourne true si la date est passée */
export function isDatePassee(dateISO: string): boolean {
  return joursRestants(dateISO) < 0;
}

/** Retourne true si l'échéance est urgente (< 30 jours) */
export function isUrgent(dateISO: string): boolean {
  const jours = joursRestants(dateISO);
  return jours >= 0 && jours <= 30;
}

/** Formate une date ISO en format lisible FR ou EN */
export function formatDate(dateISO: string, locale: 'fr' | 'en' = 'fr'): string {
  const date = new Date(dateISO);
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ─── Génération fichier ICS ────────────────────────────────

/** Génère un fichier .ics pour une échéance fiscale */
export function genererICS(echeance: Echeance, locale: 'fr' | 'en' = 'fr'): string {
  const label = locale === 'fr' ? echeance.label_fr : echeance.label_en;
  const description = locale === 'fr' ? echeance.description_fr : echeance.description_en;

  // Formater la date pour ICS (YYYYMMDD)
  const date = echeance.date.replace(/-/g, '');
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fisco.IA//Jengu.AI//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART;VALUE=DATE:${date}`,
    `DTEND;VALUE=DATE:${date}`,
    `SUMMARY:${label} — Fisco.IA`,
    `DESCRIPTION:${description} | Déclaration sur impots.cm`,
    `DTSTAMP:${now}`,
    `UID:fiscoai-${echeance.type}-${date}@jengu.ai`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/** Télécharge toutes les échéances en un seul fichier .ics */
export function exporterCalendrier(echeances: Echeance[], locale: 'fr' | 'en' = 'fr'): void {
  const events = echeances
    .filter(e => !e.passed)
    .map(e => {
      const label = locale === 'fr' ? e.label_fr : e.label_en;
      const description = locale === 'fr' ? e.description_fr : e.description_en;
      const date = e.date.replace(/-/g, '');
      const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      return [
        'BEGIN:VEVENT',
        `DTSTART;VALUE=DATE:${date}`,
        `DTEND;VALUE=DATE:${date}`,
        `SUMMARY:${label} — Fisco.IA`,
        `DESCRIPTION:${description}`,
        `DTSTAMP:${now}`,
        `UID:fiscoai-${e.type}-${date}@jengu.ai`,
        'END:VEVENT',
      ].join('\r\n');
    })
    .join('\r\n');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fisco.IA//Jengu.AI//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    events,
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'calendrier-fiscal-2026-fiscoai.ics';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Copier texte dans le presse-papier ───────────────────

export async function copierDansPressesPapier(texte: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texte);
    return true;
  } catch {
    return false;
  }
}

// ─── Formatage du résultat IGS pour copie ────────────────

export function formaterResultatIGS(result: IGSResult, locale: 'fr' | 'en' = 'fr'): string {
  if (locale === 'en') {
    return [
      '=== IGS ESTIMATE 2026 — Fisco.IA ===',
      `Applicable rate: ${result.taux}%`,
      `IGS base: ${formatFCFA(result.base)}`,
      `CAC (+10%): ${formatFCFA(result.cac)}`,
      result.abattementCGA > 0 ? `CGA reduction (-50%): -${formatFCFA(result.abattementCGA)}` : '',
      `ANNUAL TOTAL: ${formatFCFA(result.totalAnnuel)}`,
      `Per quarter: ${formatFCFA(result.parTrimestre)}`,
      '',
      'Indicative only — official filing at impots.cm',
      'Fisco.IA by Jengu.AI — Douala, Cameroon',
    ].filter(Boolean).join('\n');
  }

  return [
    '=== ESTIMATION IGS 2026 — Fisco.IA ===',
    `Taux applicable : ${result.taux}%`,
    `Base IGS : ${formatFCFA(result.base)}`,
    `CAC (+10%) : ${formatFCFA(result.cac)}`,
    result.abattementCGA > 0 ? `Abattement CGA (-50%) : -${formatFCFA(result.abattementCGA)}` : '',
    `TOTAL ANNUEL : ${formatFCFA(result.totalAnnuel)}`,
    `Par trimestre : ${formatFCFA(result.parTrimestre)}`,
    '',
    'Indicatif — déclaration officielle sur impots.cm',
    'Fisco.IA · Un produit Jengu.AI · Douala, Cameroun',
  ].filter(Boolean).join('\n');
}
