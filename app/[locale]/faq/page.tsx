'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import { cn } from '@/lib/utils';

interface FAQItem {
  id: string;
  question_fr: string;
  question_en: string;
  answer_fr: string;
  answer_en: string;
  source: string;
  tags: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    question_fr: "C'est quoi l'IGS en 2026 ?",
    question_en: "What is IGS in 2026?",
    answer_fr: "L'IGS (Impôt Général Synthétique) est un régime fiscal simplifié pour les TPE et PME dont le chiffre d'affaires annuel HT est strictement inférieur à 50 000 000 FCFA. Il remplace plusieurs impôts par un taux unique sur le CA, facilitant la conformité fiscale des petites entreprises. En 2026, il est pleinement structuré par la Loi de Finances (Art. C38-C44 CGI).",
    answer_en: "IGS (General Synthetic Tax) is a simplified tax regime for micro and small enterprises with annual turnover strictly below 50,000,000 FCFA. It replaces several taxes with a single rate on turnover, simplifying tax compliance for small businesses. In 2026, it is fully structured by the Finance Law (Art. C38-C44 of the Tax Code).",
    source: "Art. C38-C44 CGI — LF 2026",
    tags: ['IGS'],
  },
  {
    id: '2',
    question_fr: "Quelle est la différence entre IGS et Régime Réel ?",
    question_en: "What is the difference between IGS and the Standard Regime?",
    answer_fr: "L'IGS s'applique aux entreprises avec un CA < 50M FCFA. Le taux est calculé sur le CA brut, sans déduction de charges. Le Régime Réel (normal ou simplifié) s'applique au-delà de 50M FCFA : l'impôt est calculé sur le bénéfice net, avec comptabilité complète obligatoire. Le régime réel est plus complexe mais peut être plus avantageux si l'entreprise a des charges élevées.",
    answer_en: "IGS applies to businesses with turnover below 50M FCFA. The rate is calculated on gross turnover, without deducting expenses. The Standard Regime applies above 50M FCFA: tax is calculated on net profit, with full accounting required. The standard regime is more complex but may be advantageous if the business has high expenses.",
    source: "Art. C38 CGI — LF 2026",
    tags: ['IGS'],
  },
  {
    id: '3',
    question_fr: "Je dois payer la TVA ?",
    question_en: "Do I need to pay VAT?",
    answer_fr: "Non, si vous êtes sous le régime IGS (CA < 50M FCFA). La TVA s'applique uniquement aux entreprises dont le CA annuel est supérieur ou égal à 50 000 000 FCFA. Le taux TVA au Cameroun est de 19,25% (17,5% + 10% de CAC). En tant qu'assujetti IGS, vous n'êtes ni collecteur ni déducteur de TVA.",
    answer_en: "No, if you are under the IGS regime (turnover below 50M FCFA). VAT applies only to businesses with annual turnover of 50,000,000 FCFA or more. The VAT rate in Cameroon is 19.25% (17.5% + 10% CAC). As an IGS taxpayer, you neither collect nor deduct VAT.",
    source: "Art. C38 CGI + TVA — LF 2026",
    tags: ['TVA', 'IGS'],
  },
  {
    id: '4',
    question_fr: "Comment obtenir mon NIU ?",
    question_en: "How do I get my NIU?",
    answer_fr: "Le NIU (Numéro d'Identification Unique) s'obtient auprès du Centre Régional des Impôts (CRI) lors de l'immatriculation de votre entreprise. Documents généralement requis : statuts ou attestation d'activité, pièce d'identité, justificatif de domicile de l'entreprise. À Douala, le CRI principal est situé à Bonanjo. La démarche peut aussi être initiée en ligne sur impots.cm.",
    answer_en: "The NIU (Unique Identification Number) is obtained from the Regional Tax Center (CRI) when registering your business. Documents typically required: company statutes or activity certificate, ID, proof of business address. In Douala, the main CRI is located in Bonanjo. The process can also be started online at impots.cm.",
    source: "Procédures DGI — impots.cm",
    tags: ['Procédures'],
  },
  {
    id: '5',
    question_fr: "Qu'est-ce qu'un CGA et pourquoi y adhérer ?",
    question_en: "What is a CGA and why join one?",
    answer_fr: "Un Centre de Gestion Agréé (CGA) est un organisme qui aide les TPE/PME à tenir leur comptabilité et à remplir leurs obligations fiscales. En adhérant à un CGA, vous bénéficiez d'un abattement de 50% sur la contribution des licences (Art. C37 CGI — LF 2026). Le CGA offre aussi un appui comptable, fiscal et juridique à tarif accessible. C'est fortement recommandé pour les entreprises sans comptable interne.",
    answer_en: "A Centre de Gestion Agréé (CGA) is an organization that helps micro and small businesses maintain their accounting and meet their tax obligations. By joining a CGA, you benefit from a 50% reduction on business license fees (Art. C37 GTC — FL 2026). The CGA also provides accessible accounting, tax and legal support. It is strongly recommended for businesses without an in-house accountant.",
    source: "Art. C37 CGI — LF 2026",
    tags: ['CGA', 'Avantages'],
  },
  {
    id: '6',
    question_fr: "Quelles sont les sanctions en cas de retard de déclaration ?",
    question_en: "What are the penalties for late filing?",
    answer_fr: "En cas de retard de déclaration et/ou de paiement, des pénalités s'appliquent : majoration de 25% du montant dû pour retard de déclaration, intérêts de retard de 1,5% par mois. En cas de défaut total de déclaration, la majoration peut atteindre 100%. La DGI peut également procéder à des redressements d'office. La régularisation rapide permet souvent de réduire les pénalités. Consultez impots.cm pour les barèmes exacts.",
    answer_en: "For late filing and/or payment, penalties apply: 25% surcharge on the amount due for late filing, 1.5% monthly late interest. In case of complete failure to file, the surcharge can reach 100%. The DGI can also conduct ex officio assessments. Quick regularization can often reduce penalties. Check impots.cm for exact rates.",
    source: "CGI — Procédures fiscales",
    tags: ['Sanctions'],
  },
  {
    id: '7',
    question_fr: "Comment fonctionne la télédéclaration sur impots.cm ?",
    question_en: "How does e-filing on impots.cm work?",
    answer_fr: "La télédéclaration est obligatoire pour tous les impôts depuis la LF 2026. Rendez-vous sur impots.cm, créez votre espace contribuable avec votre NIU, puis connectez-vous pour accéder aux formulaires de déclaration en ligne. Vous pouvez déclarer et payer vos impôts directement (MTN MoMo, Orange Money, virement). Fisco.IA vous aide à préparer vos calculs AVANT de vous connecter sur impots.cm.",
    answer_en: "E-filing is mandatory for all taxes since Finance Law 2026. Go to impots.cm, create your taxpayer account with your NIU, then log in to access online declaration forms. You can declare and pay your taxes directly (MTN MoMo, Orange Money, bank transfer). Fisco.IA helps you prepare your calculations BEFORE logging in to impots.cm.",
    source: "LF 2026 — Télédéclaration obligatoire",
    tags: ['Procédures'],
  },
  {
    id: '8',
    question_fr: "C'est quoi la DSF et qui est concerné ?",
    question_en: "What is the DSF and who is affected?",
    answer_fr: "La DSF (Déclaration Statistique et Fiscale) est la déclaration annuelle obligatoire pour les entreprises du régime réel (CA ≥ 50M FCFA). Elle synthétise les données comptables et fiscales de l'exercice annuel. La DSF doit être déposée avant le 15 mars de l'année suivante sur impots.cm. Les entreprises au régime IGS (CA < 50M FCFA) ne sont pas concernées par la DSF.",
    answer_en: "The DSF (Statistical and Tax Declaration) is the annual mandatory declaration for standard regime businesses (turnover ≥ 50M FCFA). It summarizes the accounting and tax data for the financial year. The DSF must be filed before March 15 of the following year on impots.cm. IGS regime businesses (turnover below 50M FCFA) are not subject to DSF.",
    source: "CGI — LF 2026",
    tags: ['Procédures'],
  },
  {
    id: '9',
    question_fr: "Crédit d'impôt emploi jeunes — comment en bénéficier ?",
    question_en: "Youth employment tax credit — how to benefit?",
    answer_fr: "La LF 2026 prévoit un crédit d'impôt de 20% pour les entreprises qui embauchent des jeunes diplômés camerounais. Ce crédit vient en déduction de l'impôt dû. Pour en bénéficier : documenter les embauches éligibles, produire les pièces justificatives lors de votre déclaration annuelle sur impots.cm. Les conditions précises sont définies par décret d'application — consultez un expert-comptable ONECCA pour valider votre situation.",
    answer_en: "Finance Law 2026 provides a 20% tax credit for businesses that hire young Cameroonian graduates. This credit is deducted from the tax due. To benefit: document eligible hires, provide supporting documents when filing your annual declaration on impots.cm. The precise conditions are defined by implementing decree — consult an ONECCA accountant to validate your situation.",
    source: "LF 2026 — Crédit d'impôt emploi",
    tags: ['Avantages'],
  },
  {
    id: '10',
    question_fr: "Commerce vs Services pour l'IGS : quelle différence ?",
    question_en: "Commerce vs Services for IGS: what is the difference?",
    answer_fr: "Le secteur détermine le taux IGS applicable. Le commerce (vente, distribution, import/export) bénéficie de taux légèrement inférieurs aux services (restauration, beauté, transport, conseil), car les marges commerciales sont généralement plus faibles. Pour un CA de 10M FCFA : commerce → 2,0%, services → 2,5%. Si votre activité combine les deux, optez pour le secteur qui représente plus de 50% de votre CA.",
    answer_en: "The sector determines the applicable IGS rate. Trade (retail, distribution, import/export) benefits from slightly lower rates than services (catering, beauty, transport, consulting), as trade margins are generally lower. For a 10M FCFA turnover: trade → 2.0%, services → 2.5%. If your activity combines both, choose the sector representing more than 50% of your turnover.",
    source: "Art. C38-C44 CGI — LF 2026",
    tags: ['IGS'],
  },
];

const ALL_TAGS = ['IGS', 'TVA', 'Procédures', 'Sanctions', 'Avantages', 'CGA'];

export default function FAQPage() {
  const { t } = useT();
  const { locale } = useLangStore();
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = FAQ_DATA;
    if (activeTag) {
      items = items.filter(item => item.tags.includes(activeTag));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(item =>
        (locale === 'en' ? item.question_en : item.question_fr).toLowerCase().includes(q) ||
        (locale === 'en' ? item.answer_en : item.answer_fr).toLowerCase().includes(q)
      );
    }
    return items;
  }, [search, activeTag, locale]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary mb-1">{t('faq.title')}</h1>
        <p className="text-text-secondary text-sm">{t('faq.subtitle')}</p>
      </div>

      {/* Recherche */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('faq.search_placeholder')}
          aria-label={t('faq.search_placeholder')}
          className="input-field pl-10"
        />
      </div>

      {/* Tags de catégorie */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTag(null)}
          aria-pressed={activeTag === null}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-body font-semibold border transition-all',
            activeTag === null
              ? 'bg-blue-electric text-white border-blue-electric'
              : 'bg-navy-card border-navy-border text-text-secondary hover:border-blue-electric/30'
          )}
        >
          {t('faq.all')}
        </button>
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            aria-pressed={activeTag === tag}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-body font-semibold border transition-all',
              activeTag === tag
                ? 'bg-blue-electric text-white border-blue-electric'
                : 'bg-navy-card border-navy-border text-text-secondary hover:border-blue-electric/30'
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Accordéon */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-text-muted font-body">{t('faq.no_results')}</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item, i) => {
            const question = locale === 'en' ? item.question_en : item.question_fr;
            const answer = locale === 'en' ? item.answer_en : item.answer_fr;
            const isOpen = openId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'rounded-card border overflow-hidden transition-colors duration-200',
                  isOpen
                    ? 'border-blue-electric/30 bg-navy-card'
                    : 'border-navy-border bg-navy-card/60 hover:border-navy-border/80'
                )}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
                >
                  <span className="font-body font-semibold text-text-primary text-sm">{question}</span>
                  <ChevronDown
                    className={cn('w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-navy-border pt-4">
                        <p className="text-sm font-body text-text-secondary leading-relaxed">{answer}</p>
                        <p className="text-xs text-text-muted mt-3 font-body">
                          📖 {t('faq.source')} : {item.source}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {item.tags.map(tag => (
                            <button
                              key={tag}
                              onClick={() => setActiveTag(tag)}
                              className="px-2 py-0.5 rounded-full text-[10px] font-body bg-blue-muted/30 text-blue-glow border border-blue-electric/15 hover:bg-blue-electric/10 transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CTA vers assistant */}
      <div className="mt-10 p-5 rounded-card border border-blue-electric/20 bg-blue-electric/5 text-center">
        <MessageCircle className="w-8 h-8 text-blue-glow mx-auto mb-2" aria-hidden="true" />
        <p className="text-sm font-body text-text-secondary mb-3">{t('faq.cta')}</p>
        <Link
          href={`/${locale}/assistant`}
          className="text-sm font-body font-semibold text-blue-glow hover:text-blue-electric transition-colors"
        >
          {t('faq.cta_link')}
        </Link>
      </div>
    </div>
  );
}
