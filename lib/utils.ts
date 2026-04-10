import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formate un montant en XAF */
export function formatXAF(amount: number): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Formate une date en français */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-CM', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

/** Retourne les jours restants avant une date */
export function daysUntil(date: Date | string): number {
  const diff = new Date(date).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/** Génère un numéro de séquence (POL-2024-0001) */
export function genNumero(prefix: string, count: number): string {
  const year = new Date().getFullYear()
  return `${prefix}-${year}-${String(count).padStart(4, '0')}`
}

/** Labels lisibles pour les enums */
export const STATUT_PROSPECT_LABELS: Record<string, string> = {
  NOUVEAU: 'Nouveau',
  CONTACTE: 'Contacté',
  INTERESSE: 'Intéressé',
  DEVIS_ENVOYE: 'Devis envoyé',
  RELANCE: 'Relancé',
  CONVERTI: 'Converti',
  PERDU: 'Perdu',
}

export const STATUT_CONTRAT_LABELS: Record<string, string> = {
  ACTIF: 'Actif',
  SUSPENDU: 'Suspendu',
  EN_ATTENTE_PAIEMENT: 'En attente de paiement',
  RESILIE: 'Résilié',
  EXPIRE: 'Expiré',
  RENOUVELE: 'Renouvelé',
}

export const TYPE_PRODUIT_LABELS: Record<string, string> = {
  AUTO: 'Assurance Auto',
  VIE: 'Assurance Vie',
  MALADIE: 'Assurance Maladie',
  HABITATION: 'Multirisque Habitation',
  RC_PRO: 'RC Professionnelle',
  VOYAGE: 'Assurance Voyage',
  INCENDIE: 'Incendie & Risques Divers',
  TRANSPORT: 'Transport Marchandises',
  AUTRE: 'Autre',
}

export const STATUT_SINISTRE_LABELS: Record<string, string> = {
  DECLARE: 'Déclaré',
  EN_INSTRUCTION: 'En instruction',
  EXPERTISE_EN_COURS: 'Expertise en cours',
  INDEMNISE: 'Indemnisé',
  REJETE: 'Rejeté',
  CLOS: 'Clos',
}

export const ARRONDISSEMENTS_DOUALA = [
  'Douala I (Wouri)',
  'Douala II (Wouri)',
  'Douala III (Wouri)',
  'Douala IV (Wouri)',
  'Douala V (Wouri)',
  'Douala VI (Wouri)',
  'Bonabéri',
  'Autre',
]

// Alias pour compatibilité imports
export const TYPE_ACTIVITE_ICONS: Record<string, string> = {
  APPEL: '📞',
  EMAIL: '📧',
  VISITE: '🏠',
  DEVIS_CREE: '📄',
  CONTRAT_SIGNE: '✅',
  PAIEMENT_RECU: '💰',
  SINISTRE_DECLARE: '⚠️',
  RELANCE_RENOUVELLEMENT: '🔔',
  NOTE: '📝',
}

export const DAYS_30_MS = 30 * 24 * 60 * 60 * 1000

export const PLAN_LIMITS = {
  STARTER:    { agents: 5,  label: 'Starter',    prix: 15000 },
  PRO:        { agents: 25, label: 'Pro',         prix: 45000 },
  ENTERPRISE: { agents: Infinity, label: 'Enterprise', prix: 120000 },
}
