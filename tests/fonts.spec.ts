import type { Locator, Page } from '@playwright/test';
import { expect, test, waitForFonts } from './fixtures';
import { indexablePages, type Locale } from './support/public-pages';

// The script each language is written in decides which bundled fonts its pages need.
const script = { ro: 'latin', ru: 'cyrillic', en: 'latin' } satisfies Record<Locale, 'latin' | 'cyrillic'>;
// The bundled Cyrillic companions of DM Sans (text) and Instrument Serif (headings).
const cyrillicFaces = [
  { family: 'Manrope', file: /\/manrope-cyrillic-400-normal\.[\w-]+\.woff2$/ },
  { family: 'Noto Serif Display', file: /\/noto-serif-display-cyrillic-wdth-normal\.[\w-]+\.woff2$/ },
];
const cyrillicFile = /cyrillic/i;
// DM Sans regular, the text font, in the basic Latin subset.
const latinTextFile = /\/dm-sans-latin-400-normal\.[\w-]+\.woff2$/;
const cyrillicRange = /U\+400-45F/i;

function recordFonts(page: Page) {
  const requests: { url: string; status: number }[] = [];
  page.on('response', (response) => {
    if (response.request().resourceType() === 'font') requests.push({ url: response.url(), status: response.status() });
  });
  return requests;
}

const loadedFaces = (page: Page) => page.evaluate(() => [...document.fonts]
  .filter((face) => face.status === 'loaded')
  .map(({ family, unicodeRange }) => ({ family: family.replace(/^["']|["']$/g, ''), unicodeRange })));

// The families an element asks for, in order, as the browser resolves them.
const fontFamilies = (element: Locator) => element.evaluate((node) => getComputedStyle(node).fontFamily.split(',').map((family) => family.trim().replace(/^["']|["']$/g, '')));

for (const { locale, path } of indexablePages.filter(({ locale }) => script[locale] === 'cyrillic')) {
  test(`${locale} text and headings render with the bundled Cyrillic fonts on ${path}`, async ({ page }) => {
    const requests = recordFonts(page);
    await page.goto(path);
    await waitForFonts(page);
    // Each file is served once by this site; the shared fixture aborts every other origin.
    for (const { file } of cyrillicFaces) {
      expect(requests.filter(({ url }) => file.test(url)), `${file}`).toEqual([expect.objectContaining({ status: 200 })]);
    }

    const loaded = await loadedFaces(page);
    for (const { family } of cyrillicFaces) {
      expect(loaded, family).toContainEqual({ family, unicodeRange: expect.stringMatching(cyrillicRange) });
    }
    // Latin brand fonts have no Cyrillic glyphs, so Cyrillic text falls through to the loaded companion, not a system font.
    const heading = page.getByRole('heading', { level: 1 });
    const text = page.getByRole('main').getByRole('paragraph').first();
    expect((await fontFamilies(heading)).slice(0, 2)).toEqual(['Instrument Serif', 'Noto Serif Display']);
    expect((await fontFamilies(text)).slice(0, 2)).toEqual(['DM Sans', 'Manrope']);
  });
}

for (const { locale, path } of indexablePages.filter(({ locale }) => script[locale] === 'latin')) {
  test(`${path} downloads no Cyrillic font files in ${locale}`, async ({ page }) => {
    const requests = recordFonts(page);
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await waitForFonts(page);
    expect(requests.length).toBeGreaterThan(0);
    expect(requests.filter(({ url }) => cyrillicFile.test(url))).toEqual([]);
    const loaded = await loadedFaces(page);
    expect(loaded.filter(({ unicodeRange }) => cyrillicRange.test(unicodeRange))).toEqual([]);
    expect(loaded.map(({ family }) => family).sort()).toEqual(expect.arrayContaining(['DM Sans', 'Instrument Serif']));
  });
}

for (const { locale, path } of indexablePages.filter(({ locale }) => script[locale] === 'latin')) {
  // Without a unicode-range on each subset face, the Latin Extended face claims every character and the browser
  // requests the Latin file only after that one arrives: text swaps fonts twice and the page shifts.
  test(`${path} requests its Latin text font before any font file arrives in ${locale}`, async ({ page }) => {
    const requested: string[] = [];
    let releaseFonts!: () => void;
    const fontsReleased = new Promise<void>((resolve) => { releaseFonts = resolve; });
    await page.route('**/*.woff2', async (route) => {
      requested.push(route.request().url());
      await fontsReleased;
      await route.continue();
    });
    try {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect.poll(() => requested.filter((url) => latinTextFile.test(url))).toHaveLength(1);
    } finally {
      releaseFonts();
    }
    await waitForFonts(page);
  });
}
