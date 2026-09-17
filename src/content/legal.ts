import { Content as PrivacyRo, getHeadings as headingsPrivacyRo } from './legal/ro/privacy.md';
import { Content as TermsRo, getHeadings as headingsTermsRo } from './legal/ro/terms.md';
import { Content as DeletionRo, getHeadings as headingsDeletionRo } from './legal/ro/delete-account.md';
import { Content as PrivacyEn, getHeadings as headingsPrivacyEn } from './legal/en/privacy.md';
import { Content as TermsEn, getHeadings as headingsTermsEn } from './legal/en/terms.md';
import { Content as DeletionEn, getHeadings as headingsDeletionEn } from './legal/en/delete-account.md';
import type { Locale } from '../i18n';

export const legalPages = ['privacy', 'terms', 'delete-account'] as const;
export type LegalPage = (typeof legalPages)[number];

export const legalContent = {
  ro: {
    privacy: { Content: PrivacyRo, getHeadings: headingsPrivacyRo, title: 'Politica de confidențialitate', updated: 'Ultima actualizare: 17 septembrie 2026' },
    terms: { Content: TermsRo, getHeadings: headingsTermsRo, title: 'Condiții de utilizare', updated: 'Ultima actualizare: 20 ianuarie 2026' },
    'delete-account': { Content: DeletionRo, getHeadings: headingsDeletionRo, title: 'Șterge contul tău BookMe', updated: 'Ultima actualizare: 17 septembrie 2026' },
  },
  en: {
    privacy: { Content: PrivacyEn, getHeadings: headingsPrivacyEn, title: 'Privacy Policy', updated: 'Last updated: September 17, 2026' },
    terms: { Content: TermsEn, getHeadings: headingsTermsEn, title: 'Terms of Use', updated: 'Last updated: January 20, 2026' },
    'delete-account': { Content: DeletionEn, getHeadings: headingsDeletionEn, title: 'Delete Your BookMe Account', updated: 'Last updated: September 17, 2026' },
  },
} satisfies Record<Locale, Record<LegalPage, { Content: typeof PrivacyEn; getHeadings: typeof headingsPrivacyEn; title: string; updated: string }>>;
