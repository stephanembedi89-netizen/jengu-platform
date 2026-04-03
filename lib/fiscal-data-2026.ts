// ============================================================
// DONNÉES FISCALES CAMEROUN — Loi de Finances 2026
// Loi n° 2025/012 du 17 décembre 2025
// Source : CGI version consolidée 2026, MINFI/DGI
// ============================================================

export type Secteur = 'commerce' | 'services' | 'artisanat' | 'liberal';
export type Zone = 'urbain' | 'rural';
export type TypeEcheance = 'IGS' | 'IS' | 'DSF' | 'TVA';

export interface TrancheTaux {
  min: number;
  max: number;
  taux: number; // en pourcentage (ex: 1.5 = 1,5%)
}

export interface IGSResult {
  base: number;
  cac: number;
  sousTotal: number;
  abattementRural: number;
  abattementCGA: number;
  totalAnnuel: number;
  parTrimestre: number;
  parMois: number;
  taux: number;
  tranche: string;
}

export interface Echeance {
  date: string; // ISO format YYYY-MM-DD
  type: TypeEcheance;
  label_fr: string;
  label_en: string;
  description_fr: string;
  description_en: string;
  urgent?: boolean;
  passed?: boolean;
}

// ─── BARÈME IGS PAR SECTEUR (Art. C38-C44 CGI — LF 2026) ───

export const IGS_BAREME: Record<Secteur, TrancheTaux[]> = {
  // Vente, distribution, import/export
  commerce: [
    { min: 0,          max: 5_000_000,  taux: 1.0 },
    { min: 5_000_000,  max: 10_000_000, taux: 1.5 },
    { min: 10_000_000, max: 20_000_000, taux: 2.0 },
    { min: 20_000_000, max: 30_000_000, taux: 2.5 },
    { min: 30_000_000, max: 50_000_000, taux: 3.0 },
  ],
  // Restauration, beauté, transport, conseil
  services: [
    { min: 0,          max: 5_000_000,  taux: 1.5 },
    { min: 5_000_000,  max: 10_000_000, taux: 2.0 },
    { min: 10_000_000, max: 20_000_000, taux: 2.5 },
    { min: 20_000_000, max: 30_000_000, taux: 3.0 },
    { min: 30_000_000, max: 50_000_000, taux: 3.5 },
  ],
  // Menuiserie, couture, mécanique, BTP
  artisanat: [
    { min: 0,          max: 5_000_000,  taux: 0.8 },
    { min: 5_000_000,  max: 10_000_000, taux: 1.2 },
    { min: 10_000_000, max: 20_000_000, taux: 1.8 },
    { min: 20_000_000, max: 30_000_000, taux: 2.2 },
    { min: 30_000_000, max: 50_000_000, taux: 2.8 },
  ],
  // Médecin, avocat, comptable, architecte
  liberal: [
    { min: 0,          max: 5_000_000,  taux: 2.0 },
    { min: 5_000_000,  max: 10_000_000, taux: 2.5 },
    { min: 10_000_000, max: 20_000_000, taux: 3.0 },
    { min: 20_000_000, max: 30_000_000, taux: 3.5 },
    { min: 30_000_000, max: 50_000_000, taux: 4.0 },
  ],
};

// Seuil IGS — au-delà → Régime Réel (Art. C38 CGI)
export const IGS_SEUIL_CA = 50_000_000;

// Taux CAC (Centimes Additionnels Communaux)
export const CAC_TAUX = 0.10; // 10%

// Abattement zone rurale
export const ABATTEMENT_RURAL = 0.30; // 30%

// Abattement membres CGA (Art. C37 CGI — LF 2026)
export const ABATTEMENT_CGA = 0.50; // 50%

// Seuil TVA (CA ≥ 50M FCFA → TVA 19,25%)
export const TVA_SEUIL = 50_000_000;
export const TVA_TAUX = 0.1925;

// ─── CALENDRIER FISCAL 2026 ───

export const CALENDRIER_2026: Echeance[] = [
  {
    date: '2026-03-15',
    type: 'IS',
    label_fr: 'Acompte IS — 1er trimestre',
    label_en: 'Q1 CIT Installment',
    description_fr: 'Paiement du 1er acompte d\'impôt sur les sociétés (25% de l\'IS annuel estimé). Régime réel uniquement.',
    description_en: 'Payment of the 1st Corporate Income Tax installment (25% of estimated annual CIT). Standard regime only.',
    passed: true,
  },
  {
    date: '2026-04-30',
    type: 'IGS',
    label_fr: 'Déclaration IGS — 1er trimestre',
    label_en: 'Q1 IGS Declaration',
    description_fr: 'Déclaration et paiement de l\'IGS pour le 1er trimestre 2026. Régime simplifié (CA < 50M FCFA). Télédéclaration obligatoire sur impots.cm.',
    description_en: 'Declaration and payment of IGS for Q1 2026. Simplified regime (turnover < 50M FCFA). Mandatory e-filing on impots.cm.',
    urgent: true,
    passed: false,
  },
  {
    date: '2026-06-15',
    type: 'IS',
    label_fr: 'Acompte IS — 2ème trimestre',
    label_en: 'Q2 CIT Installment',
    description_fr: 'Paiement du 2ème acompte d\'impôt sur les sociétés. Régime réel uniquement.',
    description_en: 'Payment of the 2nd Corporate Income Tax installment. Standard regime only.',
    passed: false,
  },
  {
    date: '2026-07-30',
    type: 'IGS',
    label_fr: 'Déclaration IGS — 2ème trimestre',
    label_en: 'Q2 IGS Declaration',
    description_fr: 'Déclaration et paiement de l\'IGS pour le 2ème trimestre 2026. Télédéclaration sur impots.cm.',
    description_en: 'Declaration and payment of IGS for Q2 2026. E-filing on impots.cm.',
    passed: false,
  },
  {
    date: '2026-09-15',
    type: 'IS',
    label_fr: 'Acompte IS — 3ème trimestre',
    label_en: 'Q3 CIT Installment',
    description_fr: 'Paiement du 3ème acompte d\'impôt sur les sociétés. Régime réel uniquement.',
    description_en: 'Payment of the 3rd Corporate Income Tax installment. Standard regime only.',
    passed: false,
  },
  {
    date: '2026-10-31',
    type: 'IGS',
    label_fr: 'Déclaration IGS — 3ème trimestre',
    label_en: 'Q3 IGS Declaration',
    description_fr: 'Déclaration et paiement de l\'IGS pour le 3ème trimestre 2026. Télédéclaration sur impots.cm.',
    description_en: 'Declaration and payment of IGS for Q3 2026. E-filing on impots.cm.',
    passed: false,
  },
  {
    date: '2026-12-15',
    type: 'IS',
    label_fr: 'Acompte IS — 4ème trimestre',
    label_en: 'Q4 CIT Installment',
    description_fr: 'Paiement du 4ème acompte d\'impôt sur les sociétés. Régime réel uniquement.',
    description_en: 'Payment of the 4th Corporate Income Tax installment. Standard regime only.',
    passed: false,
  },
  {
    date: '2027-03-15',
    type: 'DSF',
    label_fr: 'Déclaration Statistique & Fiscale annuelle',
    label_en: 'Annual Statistical & Tax Filing (DSF)',
    description_fr: 'Dépôt de la Déclaration Statistique et Fiscale (DSF) pour l\'exercice 2026. Concerne les entreprises du régime réel. Délai : avant le 15 mars 2027.',
    description_en: 'Filing of the Annual Statistical and Tax Declaration (DSF) for fiscal year 2026. Applies to standard regime businesses. Deadline: before March 15, 2027.',
    passed: false,
  },
];

// Infos descriptives par type d'impôt
export const TYPE_INFO: Record<TypeEcheance, { color: string; bgColor: string; label_fr: string; label_en: string }> = {
  IGS: {
    color: '#f0a500',
    bgColor: 'rgba(240,165,0,0.12)',
    label_fr: 'IGS — Impôt Général Synthétique',
    label_en: 'IGS — General Synthetic Tax',
  },
  IS: {
    color: '#1a7fff',
    bgColor: 'rgba(26,127,255,0.12)',
    label_fr: 'IS — Impôt sur les Sociétés',
    label_en: 'CIT — Corporate Income Tax',
  },
  DSF: {
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.12)',
    label_fr: 'DSF — Déclaration Statistique & Fiscale',
    label_en: 'DSF — Annual Statistical & Tax Filing',
  },
  TVA: {
    color: '#a855f7',
    bgColor: 'rgba(168,85,247,0.12)',
    label_fr: 'TVA — Taxe sur la Valeur Ajoutée',
    label_en: 'VAT — Value Added Tax',
  },
};

// Noms des secteurs (FR + EN)
export const SECTEUR_INFO: Record<Secteur, {
  label_fr: string;
  label_en: string;
  exemples_fr: string;
  exemples_en: string;
  icon: string;
}> = {
  commerce: {
    label_fr: 'Commerce',
    label_en: 'Trade',
    exemples_fr: 'Vente, distribution, import/export',
    exemples_en: 'Retail, wholesale, import/export',
    icon: '🏪',
  },
  services: {
    label_fr: 'Services',
    label_en: 'Services',
    exemples_fr: 'Restauration, beauté, transport, conseil',
    exemples_en: 'Catering, beauty, transport, consulting',
    icon: '💼',
  },
  artisanat: {
    label_fr: 'Artisanat',
    label_en: 'Crafts & Trades',
    exemples_fr: 'Menuiserie, couture, mécanique, BTP',
    exemples_en: 'Carpentry, tailoring, mechanics, construction',
    icon: '🔨',
  },
  liberal: {
    label_fr: 'Profession libérale',
    label_en: 'Liberal Profession',
    exemples_fr: 'Médecin, avocat, comptable, architecte',
    exemples_en: 'Doctor, lawyer, accountant, architect',
    icon: '📋',
  },
};
