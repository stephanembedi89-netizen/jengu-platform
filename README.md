# Fisco.IA — Assistant Fiscal pour PME Camerounaises

**Un produit [Jengu.AI](https://jengu.ai) · Douala, Cameroun 🇨🇲**

Application web SaaS bilingue (FR/EN) d'aide à la gestion fiscale pour les TPE et PME camerounaises. Basée sur la Loi de Finances 2026.

---

## Fonctionnalités

| Module | Description |
|--------|-------------|
| **Calculateur IGS** | Estimation IGS 2026 en 4 étapes (secteur, CA, zone, CGA). Barème LF 2026 Art. C38-C44. |
| **Calendrier fiscal** | Toutes les échéances 2026. Alertes urgentes. Export `.ics`. |
| **Assistant IA** | Chat fiscal en temps réel via Anthropic API (streaming). FR + EN. |
| **FAQ** | 10 questions bilingues avec recherche et tags par catégorie. |
| **Cadre Légal** | Mentions légales, protections juridiques, sources officielles. |
| **Dashboard** | KPI cards, alertes d'échéances, actualités LF 2026. |

---

## Stack technique

- **Next.js 14** (App Router)
- **TypeScript** strict
- **Tailwind CSS** + CSS custom properties
- **Framer Motion** (animations)
- **next-intl** (i18n FR/EN)
- **Anthropic API** `claude-sonnet-4-20250514` (streaming)
- **Zustand** (état langue)
- **Lucide React** (icônes)
- **Google Fonts** : Cormorant Garamond + DM Sans

---

## Installation locale

### Prérequis
- Node.js 18+
- Une clé API Anthropic

### Étapes

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd jengu-platform

# 2. Installer les dépendances
npm install

# 3. Créer le fichier d'environnement
cp .env.local.example .env.local
# → Éditer .env.local et renseigner votre clé API Anthropic

# 4. Lancer le serveur de développement
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

---

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
ANTHROPIC_API_KEY=sk-ant-votre-cle-ici
NEXT_PUBLIC_APP_NAME=Fisco.IA
NEXT_PUBLIC_COMPANY=Jengu.AI
NEXT_PUBLIC_COMPANY_URL=https://jengu.ai
NEXT_PUBLIC_DEFAULT_LANG=fr
```

Obtenir une clé API Anthropic : [console.anthropic.com](https://console.anthropic.com)

---

## Déploiement sur Vercel

### Méthode 1 — Interface Vercel (recommandée)

1. Aller sur [vercel.com](https://vercel.com) → **New Project**
2. Importer le dépôt GitHub `stephanembedi89-netizen/jengu-platform`
3. Dans **Environment Variables**, ajouter :
   - `ANTHROPIC_API_KEY` → votre clé Anthropic
4. Cliquer **Deploy**

Vercel détecte automatiquement Next.js — aucune configuration supplémentaire.

### Méthode 2 — CLI Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
# Suivre les instructions et renseigner ANTHROPIC_API_KEY quand demandé
```

### Variables à configurer sur Vercel

| Variable | Valeur | Obligatoire |
|----------|--------|-------------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | ✅ Oui |
| `NEXT_PUBLIC_APP_NAME` | `Fisco.IA` | Non |
| `NEXT_PUBLIC_COMPANY` | `Jengu.AI` | Non |
| `NEXT_PUBLIC_COMPANY_URL` | `https://jengu.ai` | Non |

> ⚠️ Sans `ANTHROPIC_API_KEY`, l'Assistant IA retournera une erreur 500. Toutes les autres fonctionnalités restent opérationnelles.

---

## Structure du projet

```
jengu-platform/
├── app/
│   ├── page.tsx                  → Landing page marketing
│   ├── layout.tsx                → Root layout (fonts, meta)
│   ├── globals.css               → Variables CSS Jengu.AI + styles globaux
│   ├── [locale]/                 → Routes localisées (fr | en)
│   │   ├── layout.tsx            → App layout (Sidebar + Header + BottomNav)
│   │   ├── dashboard/page.tsx
│   │   ├── calculateur/page.tsx
│   │   ├── calendrier/page.tsx
│   │   ├── assistant/page.tsx
│   │   ├── faq/page.tsx
│   │   └── legal/page.tsx
│   └── api/chat/route.ts         → Route API streaming Anthropic
│
├── components/
│   ├── layout/                   → Sidebar, Header, BottomNav, Footer
│   ├── ui/                       → Button, Card, Badge, Input, Toggle, Disclaimer, LanguageToggle
│   └── modules/                  → Calculator/, Calendar/, Chat/
│
├── lib/
│   ├── fiscal-data-2026.ts       → Barèmes IGS, calendrier 2026, types
│   ├── utils.ts                  → formatFCFA(), calculerIGS(), export .ics
│   ├── constants.ts              → URLs, constantes globales
│   ├── ai-prompts.ts             → System prompts FR + EN
│   └── i18n/                     → fr.json, en.json, useTranslation.ts
│
├── middleware.ts                  → Détection locale (next-intl)
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Logique fiscale

Les barèmes IGS sont codés dans `lib/fiscal-data-2026.ts` selon la **LF 2026 (Loi n° 2025/012 du 17 décembre 2025)** :

- **Commerce** : 1,0% à 3,0% selon CA
- **Services** : 1,5% à 3,5% selon CA
- **Artisanat** : 0,8% à 2,8% selon CA
- **Professions libérales** : 2,0% à 4,0% selon CA

Abattements : Zone rurale (-30%) · Membre CGA (-50% sur licences, Art. C37 CGI)

---

## Mentions légales

> FiscoAI est un outil d'aide à la gestion fiscale édité de manière indépendante par **Jengu.AI** (Douala, Cameroun). Les informations fournies ont un caractère pédagogique et indicatif. Elles ne constituent pas un conseil fiscal opposable. La déclaration officielle doit se faire sur **[impots.cm](https://www.impots.cm)**.

---

## Contact

**Jengu.AI** · Douala, Cameroun  
📧 contact@jengu.ai  
🌐 [jengu.ai](https://jengu.ai)
