export const siteOrigin = 'https://bookme.md';
export const locales = ['ro', 'en'] as const;
export type Locale = (typeof locales)[number];

// Only canonical, indexable pages belong here. index.html aliases and 404 do not.
export const publicPages = {
  home: { ro: '/', en: '/en/' },
  privacy: { ro: '/privacy.html', en: '/en/privacy.html' },
  terms: { ro: '/terms.html', en: '/en/terms.html' },
  'delete-account': { ro: '/delete-account.html', en: '/en/delete-account.html' },
} as const satisfies Record<string, Record<Locale, string>>;
export type Page = keyof typeof publicPages;
export const pageNames = Object.keys(publicPages) as Page[];

export function pageUrl(locale: Locale, page: Page): string {
  return publicPages[page][locale];
}

export function absolutePageUrl(locale: Locale, page: Page): string {
  return new URL(pageUrl(locale, page), siteOrigin).href;
}

export function languageAlternates(page: Page) {
  return [...locales, 'x-default' as const].map((language) => ({
    language,
    href: absolutePageUrl(language === 'x-default' ? 'ro' : language, page),
  }));
}

export const labels = {
  ro: {
    navigation: 'Navigare principală',
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
  },
  en: {
    navigation: 'Main navigation',
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
  },
} satisfies Record<Locale, Record<string, string>>;
