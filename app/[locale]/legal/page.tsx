'use client';

import { motion } from 'framer-motion';
import { Shield, Link2Off, FileText, BookOpen, Award, Lock, ExternalLink } from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import Card from '@/components/ui/Card';
import { COMPANY_URL, COMPANY_EMAIL } from '@/lib/constants';

const PROTECTIONS = [
  { icon: Link2Off,  titleKey: 'legal.p1.title', descKey: 'legal.p1.desc' },
  { icon: FileText,  titleKey: 'legal.p2.title', descKey: 'legal.p2.desc' },
  { icon: BookOpen,  titleKey: 'legal.p3.title', descKey: 'legal.p3.desc' },
  { icon: Award,     titleKey: 'legal.p4.title', descKey: 'legal.p4.desc' },
  { icon: Shield,    titleKey: 'legal.p5.title', descKey: 'legal.p5.desc' },
  { icon: Lock,      titleKey: 'legal.p6.title', descKey: 'legal.p6.desc' },
];

const SOURCES = [
  { color: '#1a7fff', label_fr: 'LF 2026 — Loi n° 2025/012 du 17 décembre 2025',     label_en: 'FL 2026 — Law n° 2025/012 of December 17, 2025' },
  { color: '#4da6ff', label_fr: 'LF 2025 — Loi n° 2024/013 du 23 décembre 2024',     label_en: 'FL 2025 — Law n° 2024/013 of December 23, 2024' },
  { color: '#10b981', label_fr: 'Code Général des Impôts (CGI) — version consolidée 2026', label_en: 'General Tax Code (GTC) — consolidated version 2026' },
  { color: '#f0a500', label_fr: 'Publications officielles MINFI/DGI 2025–2026',       label_en: 'Official MINFI/DGI publications 2025–2026' },
];

const DISCLAIMER_TEXT_FR = `FiscoAI est un outil d'aide à la gestion fiscale édité de manière indépendante par Jengu.AI (Douala, Cameroun). Les informations, estimations et contenus fournis ont un caractère pédagogique et indicatif, basés sur des sources légales publiques camerounaises. Ils ne constituent en aucun cas un conseil fiscal opposable, une déclaration fiscale officielle ou une consultation d'expert-comptable au sens de la loi. FiscoAI n'est pas affilié à la Direction Générale des Impôts (DGI), au Ministère des Finances (MINFI) ou à tout autre organe public camerounais. La soumission de déclarations fiscales officielles doit se faire exclusivement via le portail impots.cm. Pour toute situation fiscale complexe, l'utilisateur est invité à consulter un expert-comptable inscrit à l'Ordre National des Experts Comptables du Cameroun (ONECCA) ou à adhérer à un Centre de Gestion Agréé (CGA).`;

const DISCLAIMER_TEXT_EN = `FiscoAI is a tax management assistance tool independently published by Jengu.AI (Douala, Cameroon). The information, estimates and content provided are educational and indicative in nature, based on public Cameroonian legal sources. They do not constitute binding tax advice, an official tax declaration, or an accountant consultation within the meaning of the law. FiscoAI is not affiliated with the Direction Générale des Impôts (DGI), the Ministry of Finance (MINFI), or any other Cameroonian public body. Official tax declarations must be submitted exclusively through the impots.cm portal. For any complex tax situation, users are encouraged to consult a chartered accountant registered with the Ordre National des Experts Comptables du Cameroun (ONECCA) or to join a Centre de Gestion Agréé (CGA).`;

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
};

export default function LegalPage() {
  const { t } = useT();
  const { locale } = useLangStore();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* En-tête */}
      <div>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-1">{t('legal.title')}</h1>
        <p className="text-text-secondary text-sm">{t('legal.subtitle')}</p>
      </div>

      {/* 6 protections légales */}
      <section>
        <h2 className="font-display text-xl font-bold text-text-primary mb-6">{t('legal.protections_title')}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {PROTECTIONS.map(({ icon: Icon, titleKey, descKey }, i) => (
            <motion.div
              key={titleKey}
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeIn}
            >
              <Card padding="md" glow="green" className="bg-success-bg/30 border-success/15 hover:border-success/25">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success-bg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-success" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-text-primary mb-1">{t(titleKey)}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{t(descKey)}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sources officielles */}
      <section>
        <h2 className="font-display text-xl font-bold text-text-primary mb-4">{t('legal.sources_title')}</h2>
        <div className="space-y-2">
          {SOURCES.map((src, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeIn}
              className="flex items-center gap-4 p-4 rounded-xl bg-navy-card border border-navy-border"
            >
              <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: src.color }} />
              <p className="text-sm font-body text-text-secondary">
                {locale === 'en' ? src.label_en : src.label_fr}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mention légale complète */}
      <section>
        <h2 className="font-display text-xl font-bold text-text-primary mb-4">{t('legal.disclaimer_title')}</h2>
        <div className="p-6 rounded-card bg-gold-soft border border-gold/20">
          <p className="font-display text-sm italic text-text-secondary leading-loose">
            {locale === 'en' ? DISCLAIMER_TEXT_EN : DISCLAIMER_TEXT_FR}
          </p>
        </div>
      </section>

      {/* CGU simplifiées */}
      <section>
        <h2 className="font-display text-xl font-bold text-text-primary mb-4">{t('legal.cgu_title')}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Usages autorisés */}
          <Card padding="md">
            <h3 className="font-display text-base font-semibold text-success mb-3">✓ {t('legal.cgu_allowed')}</h3>
            <ul className="space-y-2 text-sm text-text-secondary font-body">
              {(locale === 'en' ? [
                'Estimating your tax obligations',
                'Checking fiscal deadlines',
                'Getting informed about Cameroonian tax law',
                'Preparing documents before filing on impots.cm',
              ] : [
                "Estimer vos obligations fiscales",
                "Consulter les échéances fiscales",
                "S'informer sur la fiscalité camerounaise",
                "Préparer vos documents avant déclaration sur impots.cm",
              ]).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-success mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {/* Usages interdits */}
          <Card padding="md">
            <h3 className="font-display text-base font-semibold text-danger mb-3">✗ {t('legal.cgu_forbidden')}</h3>
            <ul className="space-y-2 text-sm text-text-secondary font-body">
              {(locale === 'en' ? [
                'Using results as official tax declarations',
                'Tax evasion or illegal optimization',
                'Reproducing content without permission',
                'Presenting Fisco.IA as an official DGI tool',
              ] : [
                "Utiliser les résultats comme déclarations officielles",
                "Évasion fiscale ou optimisation illégale",
                "Reproduire le contenu sans autorisation",
                "Présenter Fisco.IA comme un outil DGI officiel",
              ]).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-danger mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card padding="md" className="mt-4">
          <p className="text-sm text-text-secondary font-body leading-relaxed">
            <span className="font-semibold text-text-primary">{t('legal.cgu_liability')} :</span>{' '}
            {locale === 'en'
              ? 'Jengu.AI cannot be held liable for any decision made solely on the basis of Fisco.IA estimates. The tool is indicative only.'
              : 'Jengu.AI ne peut être tenu responsable de toute décision prise sur la seule base des estimations de Fisco.IA. L\'outil est indicatif uniquement.'}
          </p>
          <p className="text-sm text-text-muted font-body mt-2">⚖️ {t('legal.cgu_law')}</p>
        </Card>
      </section>

      {/* Coordonnées éditeur */}
      <section>
        <h2 className="font-display text-xl font-bold text-text-primary mb-4">{t('legal.editor_title')}</h2>
        <Card padding="md">
          <p className="font-display text-lg font-semibold text-text-primary mb-1">{t('legal.editor_name')}</p>
          <p className="text-sm text-text-secondary font-body">{t('legal.editor_desc')}</p>
          <p className="text-sm text-text-secondary font-body mt-2">
            Douala, Cameroun 🇨🇲
          </p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm font-body">
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="flex items-center gap-1.5 text-blue-glow hover:text-blue-electric transition-colors"
            >
              📧 {COMPANY_EMAIL}
            </a>
            <a
              href={COMPANY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-glow hover:text-blue-electric transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              {COMPANY_URL.replace('https://', '')}
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
}
