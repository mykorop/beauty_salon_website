// Run after `npm run build`, with `npm run preview -- --port 4328 --ignore-lock`.
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const output = 'design/booking-demo/website';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  for (const locale of ['ro', 'en']) {
    for (const width of [320, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.route('**/*', route => new URL(route.request().url()).origin === 'http://127.0.0.1:4328' ? route.continue() : route.abort());
      await page.goto(`http://127.0.0.1:4328/${locale === 'en' ? 'en/' : ''}`);
      await page.evaluate(() => document.fonts.ready);
      const demo = page.getByRole('region', { name: locale === 'en' ? 'Booking demo' : 'Demonstrație de programare', exact: true });
      await demo.screenshot({ path: `${output}/${locale}-${width}-final.png` });
      if (width === 1440) await page.locator('.hero').screenshot({ path: `${output}/${locale}-hero.png` });
      await demo.getByRole('button', { name: locale === 'en' ? 'Replay' : 'Repetă', exact: true }).click();
      for (let frame = 1; frame <= 8; frame++) {
        await expect(demo.getByText(`${frame} / 8`, { exact: true })).toBeVisible();
        if (width === 320 || (locale === 'en' && width === 1440)) await demo.getByRole('img').screenshot({ path: `${output}/${locale}-${width}-step-${frame}.png` });
        if (frame < 8) await demo.getByRole('button', { name: locale === 'en' ? 'Next step' : 'Pasul următor', exact: true }).click();
      }
      if (width === 1440) {
        await demo.getByText(locale === 'en' ? 'Read all the steps' : 'Toți pașii, pe scurt', { exact: true }).click();
        await writeFile(`design/booking-demo/accessibility-${locale}.txt`, await demo.ariaSnapshot());
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}
