// Run after `npm run build`, with `npm run preview -- --port 4328 --ignore-lock`.
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const both = process.argv.includes('--both');
const output = both ? 'design/calendar-demo/website' : 'design/booking-demo/website';
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
      const scenarios = [
        { name: 'client', label: locale === 'en' ? 'Booking demo' : 'Demonstrație de programare', frames: 8, section: '.hero' },
        ...(both ? [{ name: 'business', label: locale === 'en' ? 'Business calendar demo' : 'Demonstrație de calendar Business', frames: 6, section: '#business' }] : []),
      ];
      for (const scenario of scenarios) {
        const prefix = both ? `${scenario.name}-` : '';
        const demo = page.getByRole('region', { name: scenario.label, exact: true });
        await demo.screenshot({ path: `${output}/${prefix}${locale}-${width}-final.png` });
        if (width === 1440 || (both && width === 320)) await page.locator(scenario.section).screenshot({ path: both ? `${output}/${prefix}${locale}-${width}-section.png` : `${output}/${locale}-hero.png` });
        await demo.getByRole('button', { name: locale === 'en' ? 'Replay' : 'Repetă', exact: true }).click();
        for (let frame = 1; frame <= scenario.frames; frame++) {
          await expect(demo.getByText(`${frame} / ${scenario.frames}`, { exact: true })).toBeVisible();
          if (width === 320 || (locale === 'en' && width === 1440)) await demo.getByRole('img').screenshot({ path: `${output}/${prefix}${locale}-${width}-step-${frame}.png` });
          if (frame < scenario.frames) await demo.getByRole('button', { name: locale === 'en' ? 'Next step' : 'Pasul următor', exact: true }).click();
        }
        if (width === 1440) {
          await demo.getByText(locale === 'en' ? 'Read all the steps' : 'Toți pașii, pe scurt', { exact: true }).click();
          await writeFile(both ? `${output}/${prefix}accessibility-${locale}.txt` : `design/booking-demo/accessibility-${locale}.txt`, await demo.ariaSnapshot());
        }
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}
