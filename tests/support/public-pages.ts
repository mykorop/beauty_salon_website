// The public URL contract shared by Playwright tests, Lighthouse and demo captures.
// Paths are written out rather than computed like the site's page map, so a broken URL fails the tests.
export const locales = ['ro', 'ru', 'en'] as const;
export type Locale = (typeof locales)[number];
// Served from the site root and used as x-default.
export const defaultLocale = 'ro' satisfies Locale;
export const prefixedLocales = locales.filter((locale) => locale !== defaultLocale);
export const languageNames = { ro: 'Română', ru: 'Русский', en: 'English' } satisfies Record<Locale, string>;

export const pages = ['home', 'privacy', 'terms', 'delete-account'] as const;
export type PageName = (typeof pages)[number];
export type LegalPageName = Exclude<PageName, 'home'>;
export const legalPages = pages.filter((page): page is LegalPageName => page !== 'home');

// A language lists only the pages it has published; the default language publishes every page.
const canonicalPaths = {
  ro: { home: '/', privacy: '/privacy.html', terms: '/terms.html', 'delete-account': '/delete-account.html' },
  ru: { home: '/ru/', privacy: '/ru/privacy.html', terms: '/ru/terms.html', 'delete-account': '/ru/delete-account.html' },
  en: { home: '/en/', privacy: '/en/privacy.html', terms: '/en/terms.html', 'delete-account': '/en/delete-account.html' },
} as const satisfies Record<Locale, Partial<Record<PageName, string>>>;
type Published = { [L in Locale]: keyof (typeof canonicalPaths)[L] };
const publishedPath = (locale: Locale, page: PageName): string | undefined => (canonicalPaths[locale] as Partial<Record<PageName, string>>)[page];

// One value for each page a language has published.
export type PublishedPageTable<T> = { [L in Locale]: Record<Published[L], T> };
export function publishedValue<T>(table: PublishedPageTable<T>, locale: Locale, page: PageName): T {
  const value = (table[locale] as Partial<Record<PageName, T>>)[page];
  if (value === undefined) throw new Error(`${locale} has not published ${page}`);
  return value;
}

// Languages that have published the page (every one of the pages, for a union).
export type PublishedLocale<Page extends PageName> = { [L in Locale]: [Page] extends [Published[L]] ? L : never }[Locale];
// Languages with at least one of the legal documents.
export type AnyLegalLocale = { [Page in LegalPageName]: PublishedLocale<Page> }[LegalPageName];

export function hasPage<Page extends PageName>(locale: Locale, page: Page): locale is PublishedLocale<Page> {
  return publishedPath(locale, page) !== undefined;
}

export function pageLocales<Page extends PageName>(page: Page): PublishedLocale<Page>[] {
  return locales.filter((locale): locale is PublishedLocale<Page> => hasPage(locale, page));
}

export function pagePath<Page extends PageName>(locale: PublishedLocale<Page>, page: Page): string {
  const path = publishedPath(locale, page);
  if (path === undefined) throw new Error(`${locale} has not published ${page}`);
  return path;
}

export function homePath(locale: Locale): string {
  return canonicalPaths[locale].home;
}

// The fallbacks below restate the site's rules for pages a language has not published yet.
// Where a link to the page leads from a page in this language: its own version, or the default language's.
export function linkPath(locale: Locale, page: PageName): string {
  return publishedPath(locale, page) ?? canonicalPaths[defaultLocale][page];
}

// The language of the page that link leads to.
export function linkLocale<Page extends PageName>(locale: Locale, page: Page): PublishedLocale<Page> {
  // The default language has published every page.
  return (hasPage(locale, page) ? locale : defaultLocale) as PublishedLocale<Page>;
}

// Where the language switcher leads: the same page in that language, or that language's homepage.
export function switchPath(locale: Locale, page: PageName): string {
  return publishedPath(locale, page) ?? homePath(locale);
}

// Path of a published page's HTML file; homepages are also served directly as index.html.
export function filePath<Page extends PageName>(locale: PublishedLocale<Page>, page: Page): string {
  return page === 'home' ? `${homePath(locale)}index.html` : pagePath(locale, page);
}

// Each app's web version, linked from the homepage and named in the legal documents.
export const webApps = { client: 'https://app.bookme.md/', business: 'https://business.bookme.md/' } as const;

// Every indexable page, grouped by language in list order, with the path of its HTML file.
export const indexablePages = locales.flatMap((locale) => pages.filter((page) => hasPage(locale, page)).map((page) => {
  const path = linkPath(locale, page);
  return { locale, page, path, file: page === 'home' ? `${path}index.html` : path };
}));
export const indexablePaths = indexablePages.map(({ path }) => path);
