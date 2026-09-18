import { Content as PrivacyRo, getHeadings as headingsPrivacyRo } from './legal/ro/privacy.md';
import { Content as TermsRo, getHeadings as headingsTermsRo } from './legal/ro/terms.md';
import { Content as DeletionRo, getHeadings as headingsDeletionRo } from './legal/ro/delete-account.md';
import { Content as PrivacyEn, getHeadings as headingsPrivacyEn } from './legal/en/privacy.md';
import { Content as TermsEn, getHeadings as headingsTermsEn } from './legal/en/terms.md';
import { Content as DeletionEn, getHeadings as headingsDeletionEn } from './legal/en/delete-account.md';
import { pageNames, type Locale, type Page } from '../i18n';

export type LegalPage = Exclude<Page, 'home'>;
export const legalPages = pageNames.filter((page): page is LegalPage => page !== 'home');

export const legalContent = {
  ro: {
    privacy: { Content: PrivacyRo, getHeadings: headingsPrivacyRo, title: 'Politica de confidențialitate', description: 'Cum prelucrează BookMe datele personale, ce date folosim și cum îți poți exercita drepturile.', updated: 'Ultima actualizare: 18 septembrie 2026' },
    terms: { Content: TermsRo, getHeadings: headingsTermsRo, title: 'Condiții de utilizare', description: 'Condițiile de utilizare BookMe pentru clienți, saloane și specialiști independenți din Moldova.', updated: 'Ultima actualizare: 17 septembrie 2026' },
    'delete-account': { Content: DeletionRo, getHeadings: headingsDeletionRo, title: 'Șterge contul tău BookMe', description: 'Cum îți ștergi contul BookMe, ce date sunt eliminate și ce informații pot fi păstrate.', updated: 'Ultima actualizare: 17 septembrie 2026' },
  },
  en: {
    privacy: { Content: PrivacyEn, getHeadings: headingsPrivacyEn, title: 'Privacy Policy', description: 'How BookMe handles personal data, what data we use, and how you can exercise your rights.', updated: 'Last updated: September 18, 2026' },
    terms: { Content: TermsEn, getHeadings: headingsTermsEn, title: 'Terms of Use', description: 'Terms of use for BookMe clients, salons and independent professionals in Moldova.', updated: 'Last updated: September 17, 2026' },
    'delete-account': { Content: DeletionEn, getHeadings: headingsDeletionEn, title: 'Delete Your BookMe Account', description: 'How to delete your BookMe account, which data is removed, and which information may be retained.', updated: 'Last updated: September 17, 2026' },
  },
} satisfies Record<Locale, Record<LegalPage, { Content: typeof PrivacyEn; getHeadings: typeof headingsPrivacyEn; title: string; description: string; updated: string }>>;
