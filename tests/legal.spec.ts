import { expect, test, waitForFonts } from './fixtures';
import AxeBuilder from '@axe-core/playwright';

for (const locale of ['ro', 'en']) {
  const prefix = locale === 'ro' ? '/' : '/en/';
  test(`privacy reader can identify the operator and exercise rights in ${locale}`, async ({ page }) => {
    await page.goto(`${prefix}privacy.html`);
    const main = page.getByRole('main');
    await expect(main).toContainText('BOOKME HUB, SRL');
    await expect(main).toContainText('str. Glinka 4, ap./of. 10, Bălți, Moldova');
    await expect(main).toContainText('BookMe Business');
    await expect(main).toContainText('BookMe Salon');
    await expect(main).toContainText('195/2024');
    await expect(main.getByRole('link', { name: 'support@bookme.md', exact: true }).first()).toHaveAttribute('href', 'mailto:support@bookme.md');
    await expect(main.getByRole('link', { name: 'centru@datepersonale.md', exact: true })).toHaveAttribute('href', 'mailto:centru@datepersonale.md');
    await main.getByRole('link', { name: locale === 'ro' ? 'Instrucțiuni de ștergere a contului' : 'Account deletion instructions', exact: true }).click();
    await expect(page).toHaveURL(`${prefix}delete-account.html`);
  });
  test(`visitor can request deletion without an account at ${prefix}delete-account.html`, async ({ page }) => {
    await page.goto(`${prefix}delete-account.html`);
    const request = page.getByRole('link', { name: locale === 'ro' ? 'Solicită ștergerea prin e-mail' : 'Request deletion by email', exact: true });
    await expect(request).toBeVisible();
    const href = new URL((await request.getAttribute('href'))!);
    expect(href.protocol).toBe('mailto:');
    expect(href.pathname).toBe('support@bookme.md');
    expect(href.searchParams.get('subject')).toBe(locale === 'ro' ? 'Cerere de ștergere a contului BookMe' : 'BookMe account deletion request');
    const main = page.getByRole('main');
    await expect(main).toContainText('BookMe Business');
    await expect(main).toContainText('BookMe Salon');
    await expect(main).toContainText(locale === 'ro' ? 'Profil → Șterge contul' : 'Profile → Delete account');
    await expect(main).toContainText(locale === 'ro' ? 'Setările administratorului → Șterge contul' : 'Administrator settings → Delete account');
    await expect(main).toContainText(locale === 'ro' ? 'Setările specialistului → Șterge contul' : 'Specialist settings → Delete account');
    await expect(main).toContainText('DELETE');
    await expect(main).toContainText(locale === 'ro' ? '30 de zile' : '30 days');
    await expect(main).toContainText(locale === 'ro' ? '90 de zile' : '90 days');
  });
  for (const document of ['privacy', 'terms', 'delete-account']) {
    for (const width of [320, 768, 1440]) {
      test(`${prefix}${document}.html is readable and accessible at ${width}px`, async ({ page, javaScriptEnabled }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${prefix}${document}.html`);
        await waitForFonts(page);
        const dimensions = await page.evaluate(() => {
          return { content: window.document.documentElement.scrollWidth, viewport: window.innerWidth };
        });
        expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        if (javaScriptEnabled) {
          const results = await new AxeBuilder({ page }).analyze();
          expect(results.violations).toEqual([]);
        }
      });
    }

    test(`${prefix}${document}.html has working local links and printable content`, async ({ page, request }) => {
      await page.goto(`${prefix}${document}.html`);
      const links = await page.getByRole('main').getByRole('link').evaluateAll((anchors) => anchors.map((a) => (a as HTMLAnchorElement).href));
      const origin = new URL(page.url()).origin;
      const localPages = new Set(links.filter((link) => new URL(link).origin === origin).map((link) => link.split('#')[0]));
      for (const url of localPages) {
        const response = await request.get(url);
        expect(response.status(), url).toBe(200);
      }
      await page.emulateMedia({ media: 'print' });
      await expect(page.getByRole('banner')).toBeHidden();
      await expect(page.getByRole('contentinfo')).toBeHidden();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await expect(page.getByRole('heading', { level: 2 }).last()).toHaveCSS('color', 'rgb(0, 0, 0)');
      await expect(page.getByRole('main').getByRole('link', { name: 'support@bookme.md', exact: true }).first()).toBeVisible();
    });

    test(`reader can navigate every section of ${prefix}${document}.html`, async ({ page }) => {
      await page.goto(`${prefix}${document}.html`);
      const contents = page.getByRole('navigation', { name: locale === 'ro' ? 'Cuprins' : 'Contents', exact: true });
      await expect(contents).toBeVisible();
      const links = contents.getByRole('link');
      const headings = page.getByRole('main').getByRole('heading', { level: 2 });
      expect(await links.count()).toBeGreaterThan(0);
      await expect(links).toHaveCount(await headings.count());
      await links.first().focus();
      await expect(links.first()).toHaveCSS('outline-style', 'solid');
      await page.keyboard.press('Enter');
      await expect(headings.first()).toBeInViewport();
      for (const link of await links.all()) {
        const href = await link.getAttribute('href');
        expect(href).toMatch(/^#.+/);
        await link.click();
        const target = page.locator(href!);
        await expect(target).toHaveCount(1);
        await expect(target).toBeInViewport();
        await expect(target).toHaveText((await link.textContent())!);
      }
      const day = document === 'privacy' ? 18 : 17;
      await expect(page.getByRole('main')).toContainText(locale === 'ro' ? `${day} septembrie 2026` : `September ${day}, 2026`);
    });
  }
}
