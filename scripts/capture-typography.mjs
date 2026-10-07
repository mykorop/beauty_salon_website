// Run after `npm run build`, with `npm run preview -- --port 4328 --ignore-lock`.
// Captures the homepage typography of every language for the visual review in design/typography.
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { homePath, locales } from '../tests/support/public-pages.ts';

const output = 'design/typography';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  for (const locale of locales) {
    for (const [width, height] of [[320, 700], [768, 1000], [1440, 900]]) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.route('**/*', (route) => new URL(route.request().url()).origin === 'http://127.0.0.1:4328' ? route.continue() : route.abort());
      await page.goto(`http://127.0.0.1:4328${homePath(locale)}`);
      // Acknowledging the notice keeps the floating banner out of the typography captures.
      await page.locator('#cookie-notice [data-choice]').click();
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `${output}/${locale}-${width}-hero.png` });
      // The audience headings and body copy show both families at section scale.
      await page.locator('#business').evaluate((section) => section.scrollIntoView({ block: 'start' }));
      await page.screenshot({ path: `${output}/${locale}-${width}-business.png` });
      await context.close();
    }
  }
} finally {
  await browser.close();
}
