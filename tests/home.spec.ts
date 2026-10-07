import { expect, test, waitForFonts } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
import { homePath, locales, type Locale } from './support/public-pages';

const illustrations = { ro: /ilustrativ/, ru: /Иллюстративный/, en: /Illustrative/ } satisfies Record<Locale, RegExp>;

for (const path of locales.map(homePath)) {
  test(`visitors can download the correct client and business apps from ${path}`, async ({ page }) => {
    await page.goto(path);
    const client = page.getByRole('region', { name: 'BookMe', exact: true });
    const business = page.getByRole('region', { name: 'BookMe Business', exact: true });

    await expect(client.getByRole('link', { name: /Google Play/ })).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=md.bookme.client');
    await expect(client.getByRole('link', { name: /App Store/ })).toHaveAttribute('href', 'https://apps.apple.com/us/app/bookme/id6779576243');
    await expect(business.getByRole('link', { name: /Google Play/ })).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=md.bookme.business');
    await expect(business.getByRole('link', { name: /App Store/ })).toHaveAttribute('href', 'https://apps.apple.com/ua/app/bookme-salon/id6779576340?l=uk');
    await expect(business).toContainText('BookMe Salon');
    await expect(page.locator('a[href="#"]')).toHaveCount(0);
  });
}

for (const locale of locales) {
  const path = homePath(locale);
  for (const width of [320, 768, 1440]) {
    test(`homepage content stays visible and fits ${width}px on ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await waitForFonts(page);
      const dimensions = await page.evaluate(() => {
        return { content: document.documentElement.scrollWidth, viewport: window.innerWidth };
      });
      expect(dimensions.viewport).toBe(width);
      expect(dimensions.content).toBeLessThanOrEqual(width);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('#how-it-works').getByRole('listitem')).toHaveCount(3);
      for (const section of ['clients', 'business', 'download']) {
        await expect(page.locator(`#${section}`)).toBeVisible();
        await expect(page.locator(`#${section}`)).toHaveCSS('opacity', '1');
      }
      await expect(page.getByRole('img', { name: illustrations[locale] })).toHaveCount(2);
    });

    test(`homepage has no axe violations at ${width}px on ${path}`, async ({ page, javaScriptEnabled }) => {
      test.skip(!javaScriptEnabled, 'axe requires JavaScript; content and navigation are tested separately without it.');
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await waitForFonts(page);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }
}

const journeys = {
  ro: {
    clientLink: 'Vreau o programare', businessLink: 'Îmi organizez afacerea',
    clientTitle: 'Un loc pentru rutina ta de îngrijire.', businessTitle: 'Agenda ta. Echipa ta. În același loc.',
    clientFeatures: ['Caută în Moldova', 'Alege ce ți se potrivește', 'Gestionează-ți programările'],
    businessFeatures: ['Calendarul de lucru', 'Serviciile tale', 'În echipă sau independent'],
    clientDownload: 'Descarcă BookMe pentru clienți', businessDownload: 'Descarcă BookMe Business',
  },
  ru: {
    clientLink: 'Хочу записаться', businessLink: 'Управлять своим бизнесом',
    clientTitle: 'Ваш уход за собой — всегда под рукой.', businessTitle: 'Ваш календарь. Ваша команда. В одном месте.',
    clientFeatures: ['Поиск по Молдове', 'Выбирайте то, что подходит', 'Управляйте записями'],
    businessFeatures: ['Рабочий календарь', 'Ваши услуги', 'В команде или самостоятельно'],
    clientDownload: 'Скачать BookMe для клиентов', businessDownload: 'Скачать BookMe Business',
  },
  en: {
    clientLink: 'Find my next appointment', businessLink: 'Organize my business',
    clientTitle: 'A place for your beauty routine.', businessTitle: 'Your calendar. Your team. Together.',
    clientFeatures: ['Search in Moldova', 'Choose what suits you', 'Manage your appointments'],
    businessFeatures: ['Your working calendar', 'Your services', 'With a team or on your own'],
    clientDownload: 'Download BookMe for clients', businessDownload: 'Download BookMe Business',
  },
} satisfies Record<Locale, Record<string, string | string[]>>;

for (const locale of locales) {
  const language = { path: homePath(locale), ...journeys[locale] };
  test(`clients and independent professionals can follow their own path on ${language.path}`, async ({ page }) => {
    await page.goto(language.path);
    await page.getByRole('link', { name: language.clientLink, exact: true }).click();
    await expect(page).toHaveURL(`${language.path}#clients`);
    const client = page.getByRole('region', { name: language.clientTitle, exact: true });
    await expect(client).toBeInViewport();
    for (const name of language.clientFeatures) await expect(client.getByRole('heading', { name, exact: true })).toBeVisible();
    await client.getByRole('link', { name: language.clientDownload }).click();
    await expect(page.getByRole('region', { name: 'BookMe', exact: true })).toBeInViewport();

    await page.getByRole('link', { name: language.businessLink, exact: true }).click();
    await expect(page).toHaveURL(`${language.path}#business`);
    const business = page.getByRole('region', { name: language.businessTitle, exact: true });
    await expect(business).toBeInViewport();
    for (const name of language.businessFeatures) await expect(business.getByRole('heading', { name, exact: true })).toBeVisible();
    await business.getByRole('link', { name: language.businessDownload }).click();
    await expect(page.getByRole('region', { name: 'BookMe Business', exact: true })).toBeInViewport();
  });
}
