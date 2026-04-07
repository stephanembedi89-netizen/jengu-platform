'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IGSResult, Secteur, Zone } from './fiscal-data-2026';

// ─── Types ─────────────────────────────────────────────────

export interface SavedCalc {
  ca: number;
  secteur: Secteur;
  zone: Zone;
  membreCGA: boolean;
  result: IGSResult;
  savedAt: number; // timestamp ms
}

export interface CalcDraft {
  step: number;
  secteur: Secteur | null;
  ca: number;
  zone: Zone;
  membreCGA: boolean;
}

const DEFAULT_DRAFT: CalcDraft = {
  step: 1,
  secteur: null,
  ca: 0,
  zone: 'urbain',
  membreCGA: false,
};

// ─── Store ─────────────────────────────────────────────────

interface FiscoStore {
  /** Dernière simulation IGS sauvegardée (persistée localStorage) */
  lastCalc: SavedCalc | null;
  saveCalc: (calc: SavedCalc) => void;
  clearCalc: () => void;

  /** État du formulaire calculateur (session uniquement, non persisté) */
  draft: CalcDraft;
  updateDraft: (patch: Partial<CalcDraft>) => void;
  resetDraft: () => void;
}

export const useFiscoStore = create<FiscoStore>()(
  persist(
    (set) => ({
      // Dernière simulation
      lastCalc: null,
      saveCalc: (calc) => set({ lastCalc: calc }),
      clearCalc: () => set({ lastCalc: null }),

      // Brouillon calculateur (non persisté — reset à chaque session)
      draft: DEFAULT_DRAFT,
      updateDraft: (patch) =>
        set((s) => ({ draft: { ...s.draft, ...patch } })),
      resetDraft: () => set({ draft: DEFAULT_DRAFT }),
    }),
    {
      name: 'fiscoai_v1',
      // Persister uniquement lastCalc (pas le draft de formulaire)
      partialize: (s) => ({ lastCalc: s.lastCalc }),
    }
  )
);
