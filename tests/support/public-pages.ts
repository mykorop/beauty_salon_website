// The public URL contract shared by Playwright tests, Lighthouse and demo captures.
// Paths are written out rather than computed like the site's page map, so a broken URL fails the tests.
export const locales = ['ro', 'en'] as const;
export type Locale = (typeof locales)[number];
// Served from the site root and used as x-default.
export const defaultLocale: Locale = 'ro';
export const prefixedLocales = locales.filter((locale) => locale !== defaultLocale);
export const languageNames = { ro: 'Română', en: 'English' } satisfies Record<Locale, string>;

export const pages = ['home', 'privacy', 'terms', 'delete-account'] as const;
export type PageName = (typeof pages)[number];
export type LegalPageName = Exclude<PageName, 'home'>;
export const legalPages = pages.filter((page): page is LegalPageName => page !== 'home');

const canonicalPaths = {
  ro: { home: '/', privacy: '/privacy.html', terms: '/terms.html', 'delete-account': '/delete-account.html' },
  en: { home: '/en/', privacy: '/en/privacy.html', terms: '/en/terms.html', 'delete-account': '/en/delete-account.html' },
} satisfies Record<Locale, Record<PageName, string>>;

export function pagePath(locale: Locale, page: PageName): string {
  return canonicalPaths[locale][page];
}

export function homePath(locale: Locale): string {
  return pagePath(locale, 'home');
}

// Path of the HTML file itself; homepages are also served directly as index.html.
export function filePath(locale: Locale, page: PageName): string {
  return page === 'home' ? `${homePath(locale)}index.html` : pagePath(locale, page);
}

// Every indexable page, grouped by language in list order.
export const indexablePages = locales.flatMap((locale) => pages.map((page) => ({ locale, page, path: pagePath(locale, page) })));
export const indexablePaths = indexablePages.map(({ path }) => path);
