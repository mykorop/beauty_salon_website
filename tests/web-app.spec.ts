import type { Locator, Page } from '@playwright/test';
import { expect, test, waitForFonts } from './fixtures';
import { homePath, locales, pagePath, pages, type Locale } from './support/public-pages';

const webApps = { client: 'https://app.bookme.md/', business: 'https://business.bookme.md/' } as const;
const { client: clientWebApp, business: businessWebApp } = webApps;

const webApp = {
  ro: {
    label: 'Deschide aplicația web',
    hero: 'Programări la salon, în ritmul tău.', downloads: 'Următorul pas începe aici.',
    browser: 'Folosește BookMe în browser',
    browserDescription: 'Ambele aplicații funcționează și în browser, pe telefon sau computer. Deschide versiunea pentru contul tău: contul de afaceri funcționează în BookMe Business, nu în aplicația pentru clienți. Pentru instalare, alege mai jos aplicația potrivită.',
    clientOption: 'Pentru clienți app.bookme.md', businessOption: 'Pentru saloane și specialiști independenți business.bookme.md',
    business: 'Agenda ta. Echipa ta. În același loc.', businessLabel: 'Deschide BookMe Business în browser',
    cardLabel: 'BookMe Business — Deschide în browser',
  },
  en: {
    label: 'Open web app',
    hero: 'Beauty appointments, at your pace.', downloads: 'Your next step starts here.',
    browser: 'Use BookMe in your browser',
    browserDescription: 'Both apps also work in your browser, on your phone or computer. Open the one for your account: business accounts work in BookMe Business, not in the client app. To install an app, choose the one that fits you below.',
    clientOption: 'For clients app.bookme.md', businessOption: 'For salons & independent professionals business.bookme.md',
    business: 'Your calendar. Your team. Together.', businessLabel: 'Open BookMe Business in your browser',
    cardLabel: 'BookMe Business — Open in browser',
  },
} satisfies Record<Locale, Record<string, string>>;

const hrefs = (area: Locator) => area.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href')));

// Every link in the area is a 44×44 target inside the viewport that no other link covers.
async function expectSeparateTargets(area: Locator, width: number, message: string) {
  const controls = await area.getByRole('link').evaluateAll((links) => links.map((link) => {
    const { x, y, width, height } = link.getBoundingClientRect();
    return { x, y, width, height };
  }));
  for (const [index, control] of controls.entries()) {
    expect(control.width).toBeGreaterThanOrEqual(44);
    expect(control.height).toBeGreaterThanOrEqual(44);
    expect(control.x).toBeGreaterThanOrEqual(0);
    expect(control.x + control.width).toBeLessThanOrEqual(width);
    for (const other of controls.slice(index + 1)) {
      const overlaps = control.x < other.x + other.width && control.x + control.width > other.x
        && control.y < other.y + other.height && control.y + control.height > other.y;
      expect(overlaps, message).toBe(false);
    }
  }
}

for (const locale of locales) {
  const language = { path: homePath(locale), ...webApp[locale] };
  test(`loading fonts does not move content below navigation on ${language.path}`, async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 900 });
    let releaseFonts!: () => void;
    const fontsReleased = new Promise<void>((resolve) => { releaseFonts = resolve; });
    await page.route('**/*.woff2', async (route) => {
      await fontsReleased;
      await route.continue();
    });
    try {
      await page.goto(language.path, { waitUntil: 'domcontentloaded' });
      const header = page.getByRole('banner');
      await expect(header.getByRole('link', { name: language.label, exact: true })).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.fonts.status)).toBe('loading');
      const before = await header.boundingBox();
      releaseFonts();
      await waitForFonts(page);
      const after = await header.boundingBox();
      expect(after!.height).toBeCloseTo(before!.height, 0);
    } finally {
      releaseFonts();
    }
  });

  const browserAccess = (page: Page) => page.getByRole('region', { name: language.browser, exact: true });
  const homepagePlacements: { app: keyof typeof webApps; placement: string; area: (page: Page) => Locator; name: string }[] = [
    { app: 'client', placement: 'hero', area: (page: Page) => page.getByRole('region', { name: language.hero, exact: true }), name: language.label },
    { app: 'client', placement: 'browser access', area: browserAccess, name: language.clientOption },
    { app: 'business', placement: 'business section', area: (page: Page) => page.getByRole('region', { name: language.business, exact: true }), name: language.businessLabel },
    { app: 'business', placement: 'business download card', area: (page: Page) => page.getByRole('region', { name: 'BookMe Business', exact: true }), name: language.cardLabel },
    { app: 'business', placement: 'browser access', area: browserAccess, name: language.businessOption },
  ];
  const placements: typeof homepagePlacements = [
    { app: 'client', placement: 'navigation', area: (page: Page) => page.getByRole('banner').getByRole('navigation'), name: language.label },
    ...homepagePlacements,
  ];
  for (const { app, placement, area, name } of placements) {
    const target = webApps[app];
    for (const activation of ['mouse', 'keyboard']) {
      test(`${activation} opens the ${app} web app in the same tab from ${placement} on ${language.path}`, async ({ page, tabKey, context }) => {
        await page.setViewportSize({ width: 320, height: 900 });
        const requests: string[] = [];
        await page.route(target, async (route) => {
          requests.push(route.request().url());
          await route.fulfill({ contentType: 'text/html', body: '<h1>Intercepted web app</h1>' });
        });
        await page.goto(language.path);
        const link = area(page).getByRole('link', { name, exact: true });
        if (activation === 'keyboard') {
          const targets = await page.locator('a, button, input, textarea, summary').count();
          for (let step = 0; step < targets; step += 1) {
            await page.keyboard.press(tabKey);
            if (await link.evaluate((element) => element === document.activeElement)) break;
          }
          await expect(link).toBeFocused();
          await expect(link).toBeInViewport();
          await expect(link).toHaveCSS('outline-style', 'solid');
          await expect(link).toHaveCSS('outline-width', '3px');
          await page.keyboard.press('Enter');
        } else {
          await link.click();
        }
        await expect(page).toHaveURL(target);
        await expect(page.getByRole('heading', { name: 'Intercepted web app' })).toBeVisible();
        expect(requests).toEqual([target]);
        expect(context.pages()).toHaveLength(1);
      });
    }
  }

  test(`homepage web links have exact addresses and fit 320, 768 and 1440px on ${language.path}`, async ({ page }) => {
    await page.goto(language.path);
    for (const { app, area, name } of homepagePlacements) {
      const link = area(page).getByRole('link', { name, exact: true });
      await expect(link).toHaveAttribute('href', webApps[app]);
      await expect(link).not.toHaveAttribute('target');
    }
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await waitForFonts(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      for (const { placement, area, name } of homepagePlacements) {
        await expect(area(page).getByRole('link', { name, exact: true })).toBeVisible();
        await expectSeparateTargets(area(page), width, `Links in ${placement} must not overlap at ${width}px`);
      }
    }
  });

  test(`browser access separates the client and business web apps above the downloads on ${language.path}`, async ({ page }) => {
    await page.goto(language.path);
    const downloads = page.getByRole('region', { name: language.downloads, exact: true });
    const browser = downloads.getByRole('region', { name: language.browser, exact: true });
    await expect(browser.getByText(language.browserDescription, { exact: true })).toBeVisible();
    expect(await hrefs(browser)).toEqual([clientWebApp, businessWebApp]);
    const clientCard = downloads.getByRole('region', { name: 'BookMe', exact: true });
    const businessCard = downloads.getByRole('region', { name: 'BookMe Business', exact: true });
    const browserBox = (await browser.boundingBox())!;
    for (const card of [clientCard, businessCard]) {
      expect(browserBox.y + browserBox.height).toBeLessThanOrEqual((await card.boundingBox())!.y);
    }
    // Business links sit next to the BookMe Business downloads and never lead to the client web app.
    expect(await hrefs(page.getByRole('region', { name: language.business, exact: true }))).toEqual([businessWebApp, '#download-business']);
    expect(await hrefs(businessCard)).toEqual([
      'https://play.google.com/store/apps/details?id=md.bookme.business', 'https://apps.apple.com/ua/app/bookme-salon/id6779576340?l=uk', businessWebApp,
    ]);
    // The client card keeps only its two store downloads.
    expect(await hrefs(clientCard)).toEqual([
      'https://play.google.com/store/apps/details?id=md.bookme.client', 'https://apps.apple.com/us/app/bookme/id6779576243',
    ]);
  });

  for (const path of pages.map((name) => pagePath(locale, name))) {
    test(`client web app is visible in navigation on ${path}`, async ({ page }) => {
      await page.goto(path);
      const header = page.getByRole('banner');
      const link = header.getByRole('navigation').getByRole('link', { name: language.label, exact: true });
      await expect(link).toHaveAttribute('href', clientWebApp);
      await expect(link).not.toHaveAttribute('target');
      expect(await hrefs(header)).not.toContain(businessWebApp);
      for (const width of [320, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await waitForFonts(page);
        await expect(link).toBeInViewport();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        await expectSeparateTargets(header, width, 'Navigation and language links must not overlap');
      }
    });
  }
}
