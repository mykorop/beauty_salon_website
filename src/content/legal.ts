import { Content as PrivacyRo, getHeadings as headingsPrivacyRo } from './legal/ro/privacy.md';
import { Content as TermsRo, getHeadings as headingsTermsRo } from './legal/ro/terms.md';
import { Content as DeletionRo, getHeadings as headingsDeletionRo } from './legal/ro/delete-account.md';
import { Content as PrivacyRu, getHeadings as headingsPrivacyRu } from './legal/ru/privacy.md';
import { Content as TermsRu, getHeadings as headingsTermsRu } from './legal/ru/terms.md';
import { Content as DeletionRu, getHeadings as headingsDeletionRu } from './legal/ru/delete-account.md';
import { Content as PrivacyEn, getHeadings as headingsPrivacyEn } from './legal/en/privacy.md';
import { Content as TermsEn, getHeadings as headingsTermsEn } from './legal/en/terms.md';
import { Content as DeletionEn, getHeadings as headingsDeletionEn } from './legal/en/delete-account.md';
import { pageNames, type Locale, type Page, type PageLocale, type PublishedPage } from '../i18n';

export type LegalPage = Exclude<Page, 'home'>;
export const legalPages = pageNames.filter((page): page is LegalPage => page !== 'home');
// Languages that have published at least one legal document.
type LegalLocale = PageLocale<LegalPage>;
interface LegalLabels { contents: string; deletionRequest: string; deletionSubject: string }
interface LegalDocument { Content: typeof PrivacyEn; getHeadings: typeof headingsPrivacyEn; title: string; description: string; updated: string }

const legalLabels = {
  ro: { contents: 'Cuprins', deletionRequest: 'Solicită ștergerea prin e-mail', deletionSubject: 'Cerere de ștergere a contului BookMe' },
  ru: { contents: 'Содержание', deletionRequest: 'Запросить удаление по электронной почте', deletionSubject: 'Запрос на удаление аккаунта BookMe' },
  en: { contents: 'Contents', deletionRequest: 'Request deletion by email', deletionSubject: 'BookMe account deletion request' },
} satisfies Record<LegalLocale, LegalLabels>;

const legalContent = {
  ro: {
    privacy: { Content: PrivacyRo, getHeadings: headingsPrivacyRo, title: 'Politica de confidențialitate', description: 'Cum prelucrează BookMe datele personale, ce date folosim și cum îți poți exercita drepturile.', updated: 'Ultima actualizare: 7 octombrie 2026' },
    terms: { Content: TermsRo, getHeadings: headingsTermsRo, title: 'Condiții de utilizare', description: 'Condițiile de utilizare BookMe pentru clienți, saloane și specialiști independenți din Moldova.', updated: 'Ultima actualizare: 7 octombrie 2026' },
    'delete-account': { Content: DeletionRo, getHeadings: headingsDeletionRo, title: 'Șterge contul tău BookMe', description: 'Cum îți ștergi contul BookMe, ce date sunt eliminate și ce informații pot fi păstrate.', updated: 'Ultima actualizare: 7 octombrie 2026' },
  },
  ru: {
    privacy: { Content: PrivacyRu, getHeadings: headingsPrivacyRu, title: 'Политика конфиденциальности', description: 'Как BookMe обрабатывает персональные данные, какие данные мы используем и как вы можете осуществить свои права.', updated: 'Последнее обновление: 7 октября 2026 г.' },
    terms: { Content: TermsRu, getHeadings: headingsTermsRu, title: 'Условия использования', description: 'Условия использования BookMe для клиентов, салонов и независимых мастеров в Молдове.', updated: 'Последнее обновление: 7 октября 2026 г.' },
    'delete-account': { Content: DeletionRu, getHeadings: headingsDeletionRu, title: 'Удаление аккаунта BookMe', description: 'Как удалить аккаунт BookMe, какие данные удаляются и какая информация может сохраниться.', updated: 'Последнее обновление: 7 октября 2026 г.' },
  },
  en: {
    privacy: { Content: PrivacyEn, getHeadings: headingsPrivacyEn, title: 'Privacy Policy', description: 'How BookMe handles personal data, what data we use, and how you can exercise your rights.', updated: 'Last updated: October 7, 2026' },
    terms: { Content: TermsEn, getHeadings: headingsTermsEn, title: 'Terms of Use', description: 'Terms of use for BookMe clients, salons and independent professionals in Moldova.', updated: 'Last updated: October 7, 2026' },
    'delete-account': { Content: DeletionEn, getHeadings: headingsDeletionEn, title: 'Delete Your BookMe Account', description: 'How to delete your BookMe account, which data is removed, and which information may be retained.', updated: 'Last updated: October 7, 2026' },
  },
} satisfies { [L in LegalLocale]: Record<Exclude<PublishedPage<L>, 'home'>, LegalDocument> };

// A published legal document with its page labels.
export function legalDocument(locale: Locale, page: LegalPage): LegalDocument & { labels: LegalLabels } {
  const documents: Partial<Record<Locale, Partial<Record<LegalPage, LegalDocument>>>> = legalContent;
  const labels: Partial<Record<Locale, LegalLabels>> = legalLabels;
  const document = documents[locale]?.[page];
  if (!document || !labels[locale]) throw new Error(`${locale} has not published ${page}`);
  return { ...document, labels: labels[locale] };
}
