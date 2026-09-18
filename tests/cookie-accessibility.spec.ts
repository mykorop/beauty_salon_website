import AxeBuilder from '@axe-core/playwright';
import { expect, test, waitForFonts } from './fixtures';

const hasProvider = process.env.BOOKME_CONSENT_TEST === '1';
for (const locale of ['ro', 'en']) {
  for (const width of [320, 768, 1440]) {
    test(`${locale} consent is usable at ${width}px with keyboard, print and progressive enhancement`, async ({ page, javaScriptEnabled, tabKey }, testInfo) => {
      const english = locale === 'en';
      await page.setViewportSize({ width, height: 800 });
      const requests: string[] = [];
      page.on('request', (request) => { if (request.url().includes('consent-test.invalid')) requests.push(request.url()); });
      await page.route('https://consent-test.invalid/**', (route) => route.fulfill({ status: 200, body: 'synthetic' }));
      await page.goto(english ? '/en/' : '/');
      await waitForFonts(page);
      const banner = page.getByRole('region', { name: english ? 'Cookies and your privacy' : 'Cookies și confidențialitatea ta' });
      await expect(banner).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      if (!javaScriptEnabled) {
        await expect(banner.getByRole('button')).toHaveCount(0);
        expect(requests).toEqual([]);
        await page.getByRole('contentinfo').getByRole('link', { name: english ? 'Cookie settings' : 'Setări cookie' }).click();
        await expect(page.getByRole('heading', { name: english ? 'Cookies and similar technologies' : 'Cookies și tehnologii similare', exact: true })).toBeInViewport();
        return;
      }
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: testInfo.outputPath('banner.png'), fullPage: false });
      const trigger = banner.getByRole('button', { name: hasProvider ? english ? 'Settings' : 'Setări' : english ? 'Details' : 'Detalii', exact: true });
      await trigger.focus();
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: english ? 'Cookie settings' : 'Setări cookie' });
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
      await banner.getByRole('button', { name: hasProvider ? english ? 'Necessary only' : 'Doar necesare' : english ? 'Understood' : 'Am înțeles', exact: true }).click();
      const footer = page.getByRole('contentinfo').getByRole('link', { name: english ? 'Cookie settings' : 'Setări cookie' });
      await footer.click();
      await expect(dialog).toContainText(hasProvider ? english ? 'Necessary only' : 'Doar necesare' : english ? 'Notice acknowledged' : 'Mesaj confirmat');
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      if (hasProvider) {
        await dialog.getByRole('checkbox').check();
        await dialog.getByRole('button', { name: english ? 'Save choice' : 'Salvează alegerea' }).click();
        await footer.click();
        await expect(dialog.getByRole('checkbox')).toBeChecked();
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
        await page.screenshot({ path: testInfo.outputPath('allowed.png') });
        await dialog.getByRole('checkbox').uncheck();
      }
      await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); }; });
      await dialog.getByRole('button', { name: english ? 'Save choice' : 'Salvează alegerea' }).click();
      await expect(dialog.getByText(english ? /^We could not save/ : /^Nu am putut salva/)).toBeVisible();
      await expect(dialog.getByRole('button', { name: english ? 'Save choice' : 'Salvează alegerea' })).toBeInViewport({ ratio: 1 });
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: testInfo.outputPath('storage-error.png') });
      await page.keyboard.press('Escape');
      await expect(footer).toBeFocused();
      await expect(footer).toBeInViewport();
      await page.getByRole('textbox', { name: english ? 'Email address' : 'Adresa de e-mail', exact: true }).focus();
      await expect(page.locator(':focus')).toBeInViewport();
    });
  }
}
