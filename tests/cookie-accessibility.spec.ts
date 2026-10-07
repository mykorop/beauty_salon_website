import AxeBuilder from '@axe-core/playwright';
import { expect, test, waitForFonts } from './fixtures';
import { consentText } from './support/consent-text';
import { homePath, locales, type Locale } from './support/public-pages';

const emailLabel = { ro: 'Adresa de e-mail', en: 'Email address' } satisfies Record<Locale, string>;

const hasProvider = process.env.BOOKME_CONSENT_TEST === '1';
for (const locale of locales) {
  const text = consentText[locale];
  for (const width of [320, 768, 1440]) {
    test(`${locale} consent is usable at ${width}px with keyboard, print and progressive enhancement`, async ({ page, javaScriptEnabled, tabKey }, testInfo) => {
      await page.setViewportSize({ width, height: 800 });
      const requests: string[] = [];
      page.on('request', (request) => { if (request.url().includes('consent-test.invalid')) requests.push(request.url()); });
      await page.route('https://consent-test.invalid/**', (route) => route.fulfill({ status: 200, body: 'synthetic' }));
      await page.goto(homePath(locale));
      await waitForFonts(page);
      const banner = page.getByRole('region', { name: text.banner });
      await expect(banner).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      if (!javaScriptEnabled) {
        await expect(banner.getByRole('button')).toHaveCount(0);
        expect(requests).toEqual([]);
        await page.getByRole('contentinfo').getByRole('link', { name: text.settings }).click();
        await expect(page.getByRole('heading', { name: text.policyHeading, exact: true })).toBeInViewport();
        return;
      }
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: testInfo.outputPath('banner.png'), fullPage: false });
      const trigger = banner.getByRole('button', { name: hasProvider ? text.configure : text.details, exact: true });
      await trigger.focus();
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: text.settings });
      await expect(dialog.getByRole('heading', { level: 2 })).toBeFocused();
      await expect(dialog.getByRole('checkbox')).not.toBeChecked();
      if (!hasProvider) await expect(dialog.getByRole('checkbox')).toBeDisabled();
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      const sizes = await dialog.locator('button, input, a').evaluateAll((elements) => elements.map((element) => { const box = element.getBoundingClientRect(); return { width: box.width, height: box.height }; }));
      expect(sizes.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true);
      const controls = await dialog.locator('button:enabled, input:enabled, a').count();
      for (let i = 0; i < controls + 1; i++) {
        await page.keyboard.press(tabKey);
        const focus = page.locator(':focus');
        await expect(focus).toBeInViewport();
        await expect(focus).toHaveCSS('outline-width', '3px');
        expect(await focus.evaluate((element) => {
          const box = element.getBoundingClientRect();
          const x = (Math.max(0, box.left) + Math.min(innerWidth, box.right)) / 2;
          const y = (Math.max(0, box.top) + Math.min(innerHeight, box.bottom)) / 2;
          return Boolean(element.closest('dialog')) && element.contains(document.elementFromPoint(x, y));
        })).toBe(true);
      }
      await dialog.evaluate((element) => { element.scrollTop = 0; });
      await page.screenshot({ path: testInfo.outputPath('settings.png') });
      await page.emulateMedia({ media: 'print' });
      await expect(dialog).toBeHidden();
      await expect(banner).toBeHidden();
      await page.emulateMedia({ media: 'screen' });
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
      expect(requests).toEqual([]);
      await banner.getByRole('button', { name: hasProvider ? text.deny : text.understood, exact: true }).click();
      const footer = page.getByRole('contentinfo').getByRole('link', { name: text.settings });
      await footer.click();
      await expect(dialog).toContainText(hasProvider ? text.deny : text.acknowledged);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      if (hasProvider) {
        await dialog.getByRole('checkbox').check();
        await dialog.getByRole('button', { name: text.save }).click();
        await footer.click();
        await expect(dialog.getByRole('checkbox')).toBeChecked();
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
        await page.screenshot({ path: testInfo.outputPath('allowed.png') });
        await dialog.getByRole('checkbox').uncheck();
      }
      await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); }; });
      await dialog.getByRole('button', { name: text.save }).click();
      await expect(dialog.getByText(text.error)).toBeVisible();
      await expect(dialog.getByRole('button', { name: text.save })).toBeInViewport({ ratio: 1 });
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: testInfo.outputPath('storage-error.png') });
      await page.keyboard.press('Escape');
      await expect(footer).toBeFocused();
      await expect(footer).toBeInViewport();
      await page.getByRole('textbox', { name: emailLabel[locale], exact: true }).focus();
      await expect(page.locator(':focus')).toBeInViewport();
    });
  }
}
