export const siteOrigin = 'https://bookme.md';
// The one list of site languages, in language-switcher order. Every localized data set is keyed by it.
export const locales = ['ro', 'en'] as const;
export type Locale = (typeof locales)[number];
// The default language is served from the site root and is the x-default alternative.
export const defaultLocale: Locale = 'ro';
// Every other language is served under /<locale>/. Marked pure so client scripts that import the list drop it.
export const prefixedLocales = /* @__PURE__ */ locales.filter((locale) => locale !== defaultLocale);

export function isLocale(value: unknown): value is Locale {
  return locales.some((locale) => locale === value);
}

// What identifies each language, independent of interface translations.
export const languages = {
  ro: { name: 'Română', ogLocale: 'ro_MD' },
  en: { name: 'English', ogLocale: 'en_US' },
} satisfies Record<Locale, { name: string; ogLocale: string }>;

// Only canonical, indexable pages belong here. index.html aliases and 404 do not.
// Paths are relative to the language's homepage.
const publicPages = {
  home: '',
  privacy: 'privacy.html',
  terms: 'terms.html',
  'delete-account': 'delete-account.html',
} as const;
export type Page = keyof typeof publicPages;
export const pageNames = Object.keys(publicPages) as Page[];

export function pageUrl(locale: Locale, page: Page): string {
  const home = locale === defaultLocale ? '/' : `/${locale}/`;
  return home + publicPages[page];
}

export function absolutePageUrl(locale: Locale, page: Page): string {
  return new URL(pageUrl(locale, page), siteOrigin).href;
}

export function languageAlternates(page: Page) {
  return [...locales, 'x-default' as const].map((language) => ({
    language,
    href: absolutePageUrl(language === 'x-default' ? defaultLocale : language, page),
  }));
}

export const labels = {
  ro: {
    navigation: 'Navigare principală',
    webApp: 'Deschide aplicația web',
    language: 'Limba paginii',
    skip: 'Sari la conținut',
    how: 'Cum funcționează',
    features: 'Funcționalități',
    contact: 'Contact',
    privacy: 'Confidențialitate',
    terms: 'Condiții',
    privacyTitle: 'Politica de confidențialitate',
    termsTitle: 'Condiții de utilizare',
    deletion: 'Ștergerea contului',
    rights: 'Toate drepturile rezervate.',
    socialImageAlt: 'BookMe — Programări la salon, în ritmul tău. Clienți, saloane și specialiști din Moldova.',
  },
  en: {
    navigation: 'Main navigation',
    webApp: 'Open web app',
    language: 'Page language',
    skip: 'Skip to content',
    how: 'How it works',
    features: 'Features',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    privacyTitle: 'Privacy Policy',
    termsTitle: 'Terms of Use',
    deletion: 'Delete your account',
    rights: 'All rights reserved.',
    socialImageAlt: 'BookMe — Beauty appointments, at your pace. Clients, salons and professionals in Moldova.',
  },
} satisfies Record<Locale, Record<string, string>>;
