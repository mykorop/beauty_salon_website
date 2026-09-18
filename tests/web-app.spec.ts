import { expect, test, waitForFonts } from './fixtures';

const languages = [
  {
    path: '/', label: 'Deschide aplicația web',
    hero: 'Programări la salon, în ritmul tău.', downloads: 'Următorul pas începe aici.',
    browserDescription: 'Folosește BookMe direct în browser, pe telefon sau computer. Pentru instalare, alege mai jos aplicația potrivită.',
  },
  {
    path: '/en/', label: 'Open web app',
    hero: 'Beauty appointments, at your pace.', downloads: 'Your next step starts here.',
    browserDescription: 'Use BookMe directly in your browser, on your phone or computer. To install an app, choose the one that fits you below.',
  },
];

for (const language of languages) {
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

  for (const placement of ['navigation', 'hero', 'downloads'] as const) {
    for (const activation of ['mouse', 'keyboard']) {
      test(`${activation} opens the web app in the same tab from ${placement} on ${language.path}`, async ({ page, tabKey, context }) => {
        await page.setViewportSize({ width: 320, height: 900 });
        const requests: string[] = [];
        await page.route('https://app.bookme.md/', async (route) => {
          requests.push(route.request().url());
          await route.fulfill({ contentType: 'text/html', body: '<h1>Intercepted web app</h1>' });
        });
        await page.goto(language.path);
        const region = placement === 'navigation'
          ? page.getByRole('banner').getByRole('navigation')
          : page.getByRole('region', { name: language[placement], exact: true });
        const link = region.getByRole('link', { name: language.label, exact: true });
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
        await expect(page).toHaveURL('https://app.bookme.md/');
        await expect(page.getByRole('heading', { name: 'Intercepted web app' })).toBeVisible();
        expect(requests).toEqual(['https://app.bookme.md/']);
        expect(context.pages()).toHaveLength(1);
      });
    }
  }

  test(`homepage offers browser access alongside app downloads on ${language.path}`, async ({ page }) => {
    await page.goto(language.path);
    const hero = page.getByRole('region', { name: language.hero, exact: true });
    const downloads = page.getByRole('region', { name: language.downloads, exact: true });
    for (const region of [hero, downloads]) {
      const link = region.getByRole('link', { name: language.label, exact: true });
      await expect(link).toHaveAttribute('href', 'https://app.bookme.md/');
      await expect(link).not.toHaveAttribute('target');
      for (const width of [320, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await waitForFonts(page);
        await expect(link).toBeVisible();
        const box = await link.boundingBox();
        expect(box!.width).toBeGreaterThanOrEqual(44);
        expect(box!.height).toBeGreaterThanOrEqual(44);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      }
    }
    await expect(downloads.getByText(language.browserDescription, { exact: true })).toBeVisible();
    for (const name of ['BookMe', 'BookMe Business']) {
      await expect(downloads.getByRole('region', { name, exact: true }).getByRole('link', { name: language.label, exact: true })).toHaveCount(0);
    }
  });

  for (const filename of ['', 'privacy.html', 'terms.html', 'delete-account.html']) {
    test(`web app is visible in navigation on ${language.path}${filename}`, async ({ page }) => {
      await page.goto(`${language.path}${filename}`);
      const header = page.getByRole('banner');
      const link = header.getByRole('navigation').getByRole('link', { name: language.label, exact: true });
      await expect(link).toHaveAttribute('href', 'https://app.bookme.md/');
      await expect(link).not.toHaveAttribute('target');
      for (const width of [320, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await waitForFonts(page);
        await expect(link).toBeInViewport();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        const controls = await header.getByRole('link').evaluateAll((links) => links.map((link) => {
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
            expect(overlaps, 'Navigation and language links must not overlap').toBe(false);
          }
        }
      }
    });
  }
}
