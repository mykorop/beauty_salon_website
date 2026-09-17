import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// The public URLs in ticket 08 are independent of the implementation's page map.
const translations = [
  { ro: '/', en: '/en/' },
  { ro: '/privacy.html', en: '/en/privacy.html' },
  { ro: '/terms.html', en: '/en/terms.html' },
  { ro: '/delete-account.html', en: '/en/delete-account.html' },
];
const origin = 'https://bookme.md';
const locales = ['ro', 'en'] as const;

test('all eight static pages have unique metadata and reciprocal canonical language URLs', async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const pair of translations) {
    for (const locale of locales) {
      const response = await page.goto(pair[locale]);
      expect(response?.status()).toBe(200);
      expect(response?.headers()['x-robots-tag'] ?? '').not.toMatch(/noindex|none/i);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('head title')).toHaveCount(1);
      const title = await page.title();
      expect(title).toContain('BookMe');
      expect(titles.has(title), `Duplicate title at ${pair[locale]}`).toBe(false);
      titles.add(title);
      const description = page.locator('head meta[name="description"]');
      await expect(description).toHaveCount(1);
      const content = (await description.getAttribute('content'))!;
      expect(content.trim().length).toBeGreaterThan(30);
      expect(descriptions.has(content), `Duplicate description at ${pair[locale]}`).toBe(false);
      descriptions.add(content);
      await expect(page.locator('h1')).toHaveCount(1);
      expect((await page.locator('h1').innerText()).trim().length).toBeGreaterThan(10);
      for (const robots of await page.locator('meta[name="robots" i], meta[name="googlebot" i]').all()) {
        expect(await robots.getAttribute('content')).not.toMatch(/noindex|none/i);
      }
      await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', origin + pair[locale]);
      await expect(page.locator('head link[hreflang]')).toHaveCount(3);
      for (const language of ['ro', 'en', 'x-default'] as const) {
        await expect(page.locator(`head link[rel="alternate"][hreflang="${language}"]`))
          .toHaveAttribute('href', origin + pair[language === 'x-default' ? 'ro' : language]);
      }
      for (const language of locales) {
        await expect(page.locator(`nav a[hreflang="${language}"]`)).toHaveAttribute('href', pair[language]);
      }
    }
  }
});

test('legacy index.html aliases identify the directory homepages as canonical', async ({ page }) => {
  for (const [alias, canonical] of [['/index.html', '/'], ['/en/index.html', '/en/']]) {
    expect((await page.goto(alias))?.status()).toBe(200);
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', origin + canonical);
    await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute('content', origin + canonical);
    await expect(page.locator('head link[hreflang="x-default"]')).toHaveAttribute('href', origin + '/');
  }
});

test('robots allows crawling and the sitemap lists exactly eight canonical URLs with language alternatives', async ({ request, page }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(robots.headers()['content-type']).toMatch(/^text\/plain/);
  expect((await robots.text()).trim()).toBe('User-agent: *\nAllow: /\nSitemap: https://bookme.md/sitemap.xml');
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/(?:application|text)\/xml/);
  const sitemap = await page.evaluate((xml) => {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    return {
      valid: !doc.querySelector('parsererror'),
      namespace: doc.documentElement.namespaceURI,
      urls: Array.from(doc.getElementsByTagName('url'), (entry) => ({
        loc: entry.getElementsByTagName('loc')[0]?.textContent,
        links: Array.from(entry.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link'), (link) => ({
          rel: link.getAttribute('rel'), language: link.getAttribute('hreflang'), href: link.getAttribute('href'),
        })),
      })),
    };
  }, await response.text());
  expect(sitemap.valid).toBe(true);
  expect(sitemap.namespace).toBe('http://www.sitemaps.org/schemas/sitemap/0.9');
  expect(sitemap.urls.map(({ loc }) => loc).sort()).toEqual(translations.flatMap((pair) => locales.map((locale) => origin + pair[locale])).sort());
  for (const pair of translations) {
    for (const locale of locales) {
      const entry = sitemap.urls.find(({ loc }) => loc === origin + pair[locale])!;
      expect(entry.links).toHaveLength(3);
      expect(entry.links).toEqual(expect.arrayContaining([
        { rel: 'alternate', language: 'ro', href: origin + pair.ro },
        { rel: 'alternate', language: 'en', href: origin + pair.en },
        { rel: 'alternate', language: 'x-default', href: origin + pair.ro },
      ]));
    }
  }
});

test('unknown URLs return a styled noindex 404 with working Romanian and English return paths', async ({ page, javaScriptEnabled }) => {
  for (const path of ['/missing-page', '/en/missing/nested.html', '/404.html']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(path === '/404.html' ? 200 : 404);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pagina nu a fost găsită');
    await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await expect(page.locator('head link[rel="canonical"], head link[hreflang], script[type="application/ld+json"]')).toHaveCount(0);
    await expect(page.getByRole('main')).toContainText('Page not found');
    for (const [label, href] of [['Înapoi la pagina principală', '/'], ['Back to the English homepage', '/en/']]) {
      const link = page.getByRole('main').getByRole('link', { name: label, exact: true });
      await expect(link).toHaveAttribute('href', href);
      await link.click();
      await expect(page).toHaveURL(href);
      await page.goto(path);
    }
  }
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  if (javaScriptEnabled) {
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(accessibility.violations).toEqual([]);
  }
});

test('JSON-LD identifies BookMe, each translated page and the two real apps without invented ratings', async ({ page }) => {
  for (const pair of translations) {
    for (const locale of locales) {
      await page.goto(pair[locale]);
      const script = page.locator('head script[type="application/ld+json"]');
      await expect(script).toHaveCount(1);
      const source = (await script.textContent())!;
      expect(source).not.toMatch(/"(?:aggregateRating|review|ratingValue|reviewCount)"\s*:/);
      const data = JSON.parse(source);
      expect(data['@context']).toBe('https://schema.org');
      const graph: Record<string, unknown>[] = data['@graph'];
      const home = pair.ro === '/';
      expect(graph).toHaveLength(home ? 5 : 3);
      expect(new Set(graph.map((node) => node['@id'])).size).toBe(graph.length);
      expect(graph.find((node) => node['@type'] === 'Organization')).toMatchObject({
        '@id': origin + '/#organization', name: 'BookMe', legalName: 'BOOKME HUB, SRL',
        url: origin + '/', email: 'support@bookme.md',
      });
      expect(graph.find((node) => node['@type'] === 'WebSite')).toMatchObject({
        '@id': origin + '/#website', name: 'BookMe', url: origin + '/', inLanguage: ['ro', 'en'],
        publisher: { '@id': origin + '/#organization' },
      });
      const webpage = graph.find((node) => node['@type'] === 'WebPage');
      expect(webpage).toMatchObject({
        '@id': origin + pair[locale] + '#webpage', url: origin + pair[locale], inLanguage: locale,
        name: await page.title(), description: await page.locator('meta[name="description"]').getAttribute('content'),
        isPartOf: { '@id': origin + '/#website' },
      });
      const apps = graph.filter((node) => node['@type'] === 'SoftwareApplication');
      expect(apps).toHaveLength(home ? 2 : 0);
      if (!home) continue;
      expect(webpage?.about).toEqual([
        { '@id': origin + '/#client-app' }, { '@id': origin + '/#business-app' },
      ]);
      for (const [id, name, category, android, ios] of [
        ['client', 'BookMe', 'LifestyleApplication', 'https://play.google.com/store/apps/details?id=md.bookme.client', 'https://apps.apple.com/us/app/bookme/id6779576243'],
        ['business', 'BookMe Business', 'BusinessApplication', 'https://play.google.com/store/apps/details?id=md.bookme.business', 'https://apps.apple.com/ua/app/bookme-salon/id6779576340?l=uk'],
      ]) {
        const app = apps.find((node) => node.name === name);
        expect(app).toMatchObject({
          '@id': origin + `/#${id}-app`, url: origin + pair[locale] + `#download-${id}`,
          applicationCategory: category, operatingSystem: ['Android', 'iOS'],
          isAccessibleForFree: true, installUrl: [android, ios], publisher: { '@id': origin + '/#organization' },
        });
        if (id === 'business') expect(app?.alternateName).toBe('BookMe Salon');
        await expect(page.locator(`#download-${id}`)).toContainText(app?.description as string);
        await expect(page.locator(`#download-${id} a[href="${android}"]`)).toHaveCount(1);
        await expect(page.locator(`#download-${id} a[href="${ios}"]`)).toHaveCount(1);
      }
    }
  }
});

test('production pages have a coherent outline, named images and working canonical internal links', async ({ page, request }) => {
  const paths = [...translations.flatMap((pair) => locales.map((locale) => pair[locale])), '/404.html'];
  const links = new Set<string>();
  const anchors = new Map<string, string[]>();
  for (const path of paths) {
    await page.goto(path);
    const content = await page.evaluate(() => ({
      headings: Array.from(document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6'), (heading) => ({
        level: Number(heading.tagName.slice(1)), text: heading.textContent?.trim(),
      })),
      images: Array.from(document.querySelectorAll('img'), (img) => img.getAttribute('alt')),
      illustrations: Array.from(document.querySelectorAll('[role="img"]'), (img) => img.getAttribute('aria-label')),
      anchors: Array.from(document.querySelectorAll('[id]'), (element) => element.id),
      links: Array.from(document.querySelectorAll('a[href], link[href], img[src], script[src]'), (element) => ({
        href: element.getAttribute('href') ?? element.getAttribute('src')!,
        text: element.tagName === 'A' ? element.getAttribute('aria-label') ?? element.textContent?.trim() : null,
      })),
    }));
    expect(content.headings[0]?.level, path).toBe(1);
    let previousLevel = 0;
    for (const heading of content.headings) {
      expect(heading.text, path).toBeTruthy();
      expect(heading.level, `${path}: ${heading.text}`).toBeLessThanOrEqual(previousLevel + 1);
      previousLevel = heading.level;
    }
    for (const alt of content.images) expect(alt, `Missing alt on ${path}`).not.toBeNull();
    for (const label of content.illustrations) expect(label, `Unnamed illustration on ${path}`).toBeTruthy();
    anchors.set(path, content.anchors);
    for (const link of content.links) {
      if (link.text !== null) expect(link.text, `Unnamed link on ${path}: ${link.href}`).toBeTruthy();
      const target = new URL(link.href, origin + path);
      if (target.origin !== origin) continue;
      expect(target.pathname, `Noncanonical link on ${path}`).not.toMatch(/\/index\.html$/);
      links.add(target.href);
    }
  }
  const checked = new Set<string>();
  for (const href of links) {
    const target = new URL(href);
    const path = target.pathname + target.search;
    if (!checked.has(path)) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), href).toBe(200);
      if (response.headers()['content-type']?.includes('text/html')) expect(paths, href).toContain(target.pathname);
      checked.add(path);
    }
    if (target.hash) expect(anchors.get(target.pathname), `Broken fragment ${href}`).toContain(decodeURIComponent(target.hash.slice(1)));
  }
});
