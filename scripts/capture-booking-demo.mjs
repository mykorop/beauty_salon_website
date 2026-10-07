// Run after `npm run build`, with `npm run preview -- --port 4328 --ignore-lock`.
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { homePath, locales } from '../tests/support/public-pages.ts';

const both = process.argv.includes('--both');
const output = both ? 'design/calendar-demo/website' : 'design/booking-demo/website';
// The app reference captures are English, so only English frames are also kept at desktop width.
const referenceLocale = 'en';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  for (const locale of locales) {
    for (const width of [320, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.route('**/*', route => new URL(route.request().url()).origin === 'http://127.0.0.1:4328' ? route.continue() : route.abort());
      await page.goto(`http://127.0.0.1:4328${homePath(locale)}`);
      await page.evaluate(() => document.fonts.ready);
      const scenarios = [
        { name: 'client', frames: 8, section: '.hero' },
        ...(both ? [{ name: 'business', frames: 6, section: '#business' }] : []),
      ];
      for (const scenario of scenarios) {
        const prefix = both ? `${scenario.name}-` : '';
        // The phone is the only labelled region in its section, so no translated name is needed.
        const demo = page.locator(scenario.section).getByRole('region');
        await demo.screenshot({ path: `${output}/${prefix}${locale}-${width}-final.png` });
        if (width === 1440 || (both && width === 320)) await page.locator(scenario.section).screenshot({ path: both ? `${output}/${prefix}${locale}-${width}-section.png` : `${output}/${locale}-hero.png` });
        await demo.locator('[data-replay]').click();
        for (let frame = 1; frame <= scenario.frames; frame++) {
          await expect(demo.getByText(`${frame} / ${scenario.frames}`, { exact: true })).toBeVisible();
          if (width === 320 || (locale === referenceLocale && width === 1440)) await demo.getByRole('img').screenshot({ path: `${output}/${prefix}${locale}-${width}-step-${frame}.png` });
          if (frame < scenario.frames) await demo.locator('[data-next]').click();
        }
        if (width === 1440) {
          await demo.locator('details > summary').click();
          await writeFile(both ? `${output}/${prefix}accessibility-${locale}.txt` : `design/booking-demo/accessibility-${locale}.txt`, await demo.ariaSnapshot());
        }
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}
