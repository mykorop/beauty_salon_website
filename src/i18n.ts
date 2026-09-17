export type Locale = 'ro' | 'en';
export type Page = 'home' | 'privacy' | 'terms' | 'delete-account';

export function pageUrl(locale: Locale, page: Page): string {
  const prefix = locale === 'en' ? '/en/' : '/';
  return page === 'home' ? prefix : `${prefix}${page}.html`;
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
