import { Content as PrivacyRo } from './legal/ro/privacy.md';
import { Content as TermsRo } from './legal/ro/terms.md';
import { Content as DeletionRo } from './legal/ro/delete-account.md';
import { Content as PrivacyEn } from './legal/en/privacy.md';
import { Content as TermsEn } from './legal/en/terms.md';
import { Content as DeletionEn } from './legal/en/delete-account.md';
import type { Locale } from '../i18n';

export const legalPages = ['privacy', 'terms', 'delete-account'] as const;
export type LegalPage = (typeof legalPages)[number];

export const legalContent = {
  ro: {
    privacy: { Content: PrivacyRo, title: 'Politica de confidențialitate', updated: 'Ultima actualizare: 20 ianuarie 2026' },
    terms: { Content: TermsRo, title: 'Condiții de utilizare', updated: 'Ultima actualizare: 20 ianuarie 2026' },
    'delete-account': { Content: DeletionRo, title: 'Șterge contul tău BookMe', updated: 'Ultima actualizare: 2 august 2026' },
  },
  en: {
    privacy: { Content: PrivacyEn, title: 'Privacy Policy', updated: 'Last updated: January 20, 2026' },
    terms: { Content: TermsEn, title: 'Terms of Use', updated: 'Last updated: January 20, 2026' },
    'delete-account': { Content: DeletionEn, title: 'Delete Your BookMe Account', updated: 'Last updated: August 2, 2026' },
  },
} satisfies Record<Locale, Record<LegalPage, { Content: typeof PrivacyEn; title: string; updated: string }>>;
