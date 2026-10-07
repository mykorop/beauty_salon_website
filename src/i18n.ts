export const siteOrigin = 'https://bookme.md';
// The one list of site languages, in language-switcher order. Every localized data set is keyed by it.
export const locales = ['ro', 'ru', 'en'] as const;
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
  ru: { name: 'Русский', ogLocale: 'ru_MD' },
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

// The pages each language has published. The default language publishes every page; a page another
// language has not published yet is linked in the default language until it is added here.
const publishedPages = {
  ro: pageNames,
  ru: pageNames,
  en: pageNames,
} as const satisfies Record<Locale, readonly Page[]>;
export type PublishedPage<L extends Locale> = (typeof publishedPages)[L][number];
// The languages that have published the page (any of the pages, for a union).
export type PageLocale<P extends Page> = { [L in Locale]: P extends PublishedPage<L> ? L : never }[Locale];

export function isPublished(locale: Locale, page: Page): boolean {
  return (publishedPages[locale] as readonly Page[]).includes(page);
}

export function pageLocales<P extends Page>(page: P): PageLocale<P>[] {
  return locales.filter((locale): locale is PageLocale<P> => isPublished(locale, page));
}

// The language of the version a link to the page leads to from a page in this language.
export function linkLocale<P extends Page>(locale: Locale, page: P): PageLocale<P> {
  return (isPublished(locale, page) ? locale : defaultLocale) as PageLocale<P>;
}

// Where a link to the page leads from a page in this language: its own version, or the default language's.
export function pageUrl(locale: Locale, page: Page): string {
  const target = linkLocale(locale, page);
  const home = target === defaultLocale ? '/' : `/${target}/`;
  return home + publicPages[page];
}

// Where the language switcher leads: the same page in that language, or its homepage until the page is translated.
export function switchUrl(language: Locale, page: Page | undefined): string {
  return pageUrl(language, page && isPublished(language, page) ? page : 'home');
}

export function absolutePageUrl(locale: Locale, page: Page): string {
  return new URL(pageUrl(locale, page), siteOrigin).href;
}

// Only the languages that have published the page are its alternatives.
export function languageAlternates(page: Page) {
  return [...pageLocales(page), 'x-default' as const].map((language) => ({
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
  ru: {
    navigation: 'Основная навигация',
    webApp: 'Открыть веб-приложение',
    language: 'Язык страницы',
    skip: 'Перейти к содержимому',
    how: 'Как это работает',
    features: 'Возможности',
    contact: 'Контакты',
    privacy: 'Конфиденциальность',
    terms: 'Условия',
    privacyTitle: 'Политика конфиденциальности',
    termsTitle: 'Условия использования',
    deletion: 'Удаление аккаунта',
    rights: 'Все права защищены.',
    socialImageAlt: 'BookMe — Запись в салон в вашем ритме. Клиенты, салоны и мастера в Молдове.',
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
