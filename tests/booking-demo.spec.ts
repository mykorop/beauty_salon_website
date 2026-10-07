import { expect, test } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
import { homePath, locales, type Locale } from './support/public-pages';

const demos = {
  ro: { label: 'Demonstrație de programare', pause: 'Pauză', resume: 'Continuă', replay: 'Repetă', next: 'Pasul următor', steps: 'Toți pașii, pe scurt', success: 'Programare confirmată cu succes!', account: 'Ana Demo · deja conectată' },
  en: { label: 'Booking demo', pause: 'Pause', resume: 'Resume', replay: 'Replay', next: 'Next step', steps: 'Read all the steps', success: 'Booking confirmed successfully!', account: 'Ana Demo · already signed in' },
} satisfies Record<Locale, Record<string, string>>;
const languages = locales.map((locale) => ({ path: homePath(locale), ...demos[locale] }));

test.describe('booking demo playback', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 1100 } });

  test('a signed-in client reaches a consistent confirmed appointment', async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled, 'Playback needs JavaScript; the static example is covered separately.');
    await page.clock.install();
    await page.goto('/en/');
    const demo = page.getByRole('region', { name: 'Booking demo', exact: true });
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.getByText('1 / 8', { exact: true })).toBeVisible();
    await expect(demo.getByText('Studio Luma', { exact: true }).filter({ visible: true })).toBeVisible();
    await page.clock.runFor(2400);
    await expect(demo.getByText('2 / 8', { exact: true })).toBeVisible();
    await page.clock.runFor(2200);
    await expect(demo.getByText('3 / 8', { exact: true })).toBeVisible();
    await expect(demo.getByText('Manicure · 300 MDL', { exact: true })).toBeVisible();
    await page.clock.runFor(2200);
    await expect(demo.getByText('4 / 8', { exact: true })).toBeVisible();
    await expect(demo.getByText('Mara Luca', { exact: true }).filter({ visible: true })).toBeVisible();
    await page.clock.runFor(2400);
    await expect(demo.getByText('5 / 8', { exact: true })).toBeVisible();
    await expect(demo.getByText('October 2026', { exact: true }).filter({ visible: true })).toBeVisible();
    await page.clock.runFor(2600);
    await expect(demo.getByText('6 / 8', { exact: true })).toBeVisible();
    await expect(demo.getByText('14:30', { exact: true }).filter({ visible: true })).toBeVisible();
    await page.clock.runFor(2200);
    await expect(demo.getByText('7 / 8', { exact: true })).toBeVisible();
    await expect(demo.getByText('Book Now · 300 MDL', { exact: true }).filter({ visible: true })).toBeVisible();
    await page.clock.runFor(2600);
    await expect(demo.getByText('8 / 8', { exact: true })).toBeVisible();
    for (const value of ['Booking confirmed successfully!', 'Studio Luma', 'Manicure', 'Mara Luca', '15 October 2026', '14:30 (1 h)', '300 MDL']) {
      await expect(demo.getByText(value, { exact: true }).filter({ visible: true })).toBeVisible();
    }
    await page.clock.runFor(30000);
    await expect(demo.getByText('8 / 8', { exact: true })).toBeVisible();
  });

  for (const language of languages) {
    test(`pause, resume and repeated replay preserve the scenario pace on ${language.path}`, async ({ page, javaScriptEnabled }) => {
      test.skip(!javaScriptEnabled, 'Playback needs JavaScript.');
      await page.clock.install();
      await page.goto(language.path);
      const demo = page.getByRole('region', { name: language.label, exact: true });
      await demo.getByRole('img').scrollIntoViewIfNeeded();
      await expect(demo.getByText('1 / 8', { exact: true })).toBeVisible();
      await page.clock.runFor(2400);
      await expect(demo.getByText('2 / 8', { exact: true })).toBeVisible();
      await demo.getByRole('button', { name: language.pause, exact: true }).click();
      await page.clock.runFor(30000);
      await expect(demo.getByText('2 / 8', { exact: true })).toBeVisible();
      await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
      await demo.getByRole('img').scrollIntoViewIfNeeded();
      await page.clock.runFor(10000);
      await expect(demo.getByRole('button', { name: language.resume, exact: true })).toBeVisible();
      await expect(demo.getByText('2 / 8', { exact: true })).toBeVisible();
      await demo.getByRole('button', { name: language.resume, exact: true }).click();
      await page.clock.runFor(2200);
      await expect(demo.getByText('3 / 8', { exact: true })).toBeVisible();
      for (let repeat = 0; repeat < 3; repeat++) await demo.getByRole('button', { name: language.replay, exact: true }).click();
      await expect(demo.getByText('1 / 8', { exact: true })).toBeVisible();
      await page.clock.runFor(2400);
      await expect(demo.getByText('2 / 8', { exact: true })).toBeVisible();
      await page.clock.runFor(14200);
      await expect(demo.getByText(language.success, { exact: true })).toBeVisible();
      await demo.getByRole('button', { name: language.replay, exact: true }).click();
      await expect(demo.getByText('1 / 8', { exact: true })).toBeVisible();
    });

    test(`leaving the viewport pauses and returning resumes only automatic pauses on ${language.path}`, async ({ page, javaScriptEnabled }) => {
      test.skip(!javaScriptEnabled, 'Playback needs JavaScript.');
      await page.clock.install();
      await page.goto(language.path);
      const demo = page.getByRole('region', { name: language.label, exact: true });
      await demo.getByRole('img').scrollIntoViewIfNeeded();
      await expect(demo.getByText('1 / 8', { exact: true })).toBeVisible();
      await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
      await expect(demo.getByRole('img')).not.toBeInViewport();
      await page.clock.runFor(30000);
      await expect(demo.getByText('1 / 8', { exact: true })).toBeVisible();
      await demo.getByRole('img').scrollIntoViewIfNeeded();
      await expect(demo.getByRole('img')).toBeInViewport({ ratio: 0.6 });
      await page.clock.runFor(2500);
      await expect(demo.getByText('2 / 8', { exact: true })).toBeVisible();
    });
  }

  test('a phone below the fold waits until most of it is visible', async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled, 'Playback needs JavaScript.');
    await page.setViewportSize({ width: 320, height: 700 });
    await page.clock.install();
    await page.goto('/en/');
    const demo = page.getByRole('region', { name: 'Booking demo', exact: true });
    await expect(demo.getByRole('img')).not.toBeInViewport();
    await page.clock.runFor(30000);
    await expect(demo.getByText('8 / 8', { exact: true })).toBeVisible();
    await demo.getByRole('img').scrollIntoViewIfNeeded();
    await expect(demo.getByText('1 / 8', { exact: true })).toBeVisible();
  });

  test('the browser visibility event suspends playback and preserves manual pause', async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled, 'Playback needs JavaScript.');
    await page.clock.install();
    await page.goto('/en/');
    const demo = page.getByRole('region', { name: 'Booking demo', exact: true });
    await demo.getByRole('img').scrollIntoViewIfNeeded();
    await expect(demo.getByText('1 / 8', { exact: true })).toBeVisible();
    // Control the browser visibility boundary; the playback implementation is untouched.
    const setHidden = async (hidden: boolean) => page.evaluate(value => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => value });
      document.dispatchEvent(new Event('visibilitychange'));
    }, hidden);
    await setHidden(true);
    await page.clock.runFor(30000);
    await expect(demo.getByText('1 / 8', { exact: true })).toBeVisible();
    await setHidden(false);
    await page.clock.runFor(2400);
    await expect(demo.getByText('2 / 8', { exact: true })).toBeVisible();
    await demo.getByRole('button', { name: 'Pause', exact: true }).click();
    await setHidden(true);
    await page.clock.runFor(30000);
    await setHidden(false);
    await page.clock.runFor(30000);
    await expect(demo.getByText('2 / 8', { exact: true })).toBeVisible();
    await expect(demo.getByRole('button', { name: 'Resume', exact: true })).toBeVisible();
  });

  test('enabling reduced motion during playback stops immediately and preserves keyboard focus', async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled, 'Playback needs JavaScript.');
    await page.clock.install();
    await page.goto('/en/');
    const demo = page.getByRole('region', { name: 'Booking demo', exact: true });
    await demo.getByRole('img').scrollIntoViewIfNeeded();
    await expect(demo.getByText('1 / 8', { exact: true })).toBeVisible();
    await demo.getByRole('button', { name: 'Pause', exact: true }).focus();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(demo.getByRole('button', { name: 'Replay', exact: true })).toBeFocused();
    await page.clock.runFor(30000);
    await expect(demo.getByText('8 / 8', { exact: true })).toBeVisible();
    await expect(demo.getByRole('button', { name: 'Pause', exact: true })).toHaveCount(0);
    await demo.getByRole('button', { name: 'Replay', exact: true }).click();
    await page.clock.runFor(30000);
    await expect(demo.getByText('1 / 8', { exact: true })).toBeVisible();
    await demo.getByRole('button', { name: 'Next step', exact: true }).click();
    await expect(demo.getByText('2 / 8', { exact: true })).toBeVisible();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.clock.runFor(30000);
    await expect(demo.getByText('2 / 8', { exact: true })).toBeVisible();
    await expect(demo.getByRole('button', { name: 'Resume', exact: true })).toBeVisible();
  });

  test('keyboard controls work and screen readers receive one stable scenario description', async ({ page, javaScriptEnabled, tabKey }) => {
    test.skip(!javaScriptEnabled, 'Playback needs JavaScript.');
    await page.clock.install();
    await page.goto('/en/');
    const demo = page.getByRole('region', { name: 'Booking demo', exact: true });
    await demo.getByRole('img').scrollIntoViewIfNeeded();
    const description = await demo.getByRole('img').getAttribute('aria-label');
    await page.getByRole('link', { name: 'See how it works' }).focus();
    await page.keyboard.press(tabKey);
    await expect(demo.getByRole('button', { name: 'Pause', exact: true })).toBeFocused();
    await expect(page.locator(':focus')).toHaveCSS('outline-width', '3px');
    await page.keyboard.press('Enter');
    await expect(demo.getByRole('button', { name: 'Resume', exact: true })).toBeFocused();
    await page.keyboard.press('Space');
    await expect(demo.getByRole('button', { name: 'Pause', exact: true })).toBeFocused();
    await page.keyboard.press(tabKey);
    await expect(demo.getByRole('button', { name: 'Replay', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(demo.getByText('1 / 8', { exact: true })).toBeVisible();
    await expect(demo.getByRole('textbox')).toHaveCount(0);
    await expect(demo.getByRole('combobox')).toHaveCount(0);
    await expect(demo.locator('[aria-live]')).toHaveCount(0);
    await page.clock.runFor(16600);
    await expect(demo.getByRole('img')).toHaveAttribute('aria-label', description!);
  });

  test('initial, paused and final states pass axe without API calls or permissions', async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled, 'axe requires JavaScript.');
    const requests: string[] = [];
    page.on('request', request => {
      if (['fetch', 'xhr'].includes(request.resourceType()) || new URL(request.url()).origin !== 'http://127.0.0.1:4329') requests.push(request.url());
    });
    await page.addInitScript(() => {
      const record = () => { document.documentElement.setAttribute('data-permission-requested', 'true'); throw new Error('Unexpected permission request'); };
      navigator.geolocation.getCurrentPosition = record;
      navigator.geolocation.watchPosition = record;
      navigator.mediaDevices.getUserMedia = record;
      Notification.requestPermission = record;
    });
    await page.clock.install();
    await page.goto('/en/');
    const demo = page.getByRole('region', { name: 'Booking demo', exact: true });
    await demo.getByRole('img').scrollIntoViewIfNeeded();
    await expect(demo.getByText('1 / 8', { exact: true })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await demo.getByRole('button', { name: 'Pause', exact: true }).click();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await demo.getByRole('button', { name: 'Resume', exact: true }).click();
    await page.clock.runFor(16600);
    await expect(demo.getByText('8 / 8', { exact: true })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(requests).toEqual([]);
    await expect(page.locator('html')).not.toHaveAttribute('data-permission-requested');
  });
});

for (const language of languages) {
  test(`every illustrated booking state passes axe on ${language.path}`, async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled, 'axe requires JavaScript.');
    await page.goto(language.path);
    const demo = page.getByRole('region', { name: language.label, exact: true });
    await demo.getByRole('button', { name: language.replay, exact: true }).click();
    for (let frame = 1; frame <= 8; frame++) {
      await expect(demo.getByText(`${frame} / 8`, { exact: true })).toBeVisible();
      expect((await new AxeBuilder({ page }).analyze()).violations, `Frame ${frame}`).toEqual([]);
      if (frame < 8) await demo.getByRole('button', { name: language.next, exact: true }).click();
    }
  });

  for (const width of [320, 768, 1440]) {
    test(`every demo frame fits ${width}px on ${language.path}`, async ({ page, javaScriptEnabled }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(language.path);
      const demo = page.getByRole('region', { name: language.label, exact: true });
      const phone = demo.getByRole('img');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(demo.getByText(language.success, { exact: true })).toBeVisible();
      if (javaScriptEnabled) await demo.getByRole('button', { name: language.replay, exact: true }).click();
      for (let frame = javaScriptEnabled ? 1 : 8; frame <= 8; frame++) {
        await expect(demo.getByText(`${frame} / 8`, { exact: true })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        const clippedText = await phone.evaluate(element => {
          const boundary = element.getBoundingClientRect();
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          const clipped: string[] = [];
          while (walker.nextNode()) {
            if (!walker.currentNode.textContent?.trim()) continue;
            const range = document.createRange();
            range.selectNode(walker.currentNode);
            for (const box of range.getClientRects()) {
              if (box.width && box.height && (box.left < boundary.left || box.right > boundary.right || box.top < boundary.top || box.bottom > boundary.bottom)) clipped.push(walker.currentNode.textContent);
            }
          }
          return clipped;
        });
        expect(clippedText).toEqual([]);
        if (javaScriptEnabled && frame < 8) await demo.getByRole('button', { name: language.next, exact: true }).click();
      }
    });
  }

  test(`static and reduced-motion visitors can read the full example on ${language.path}`, async ({ page, javaScriptEnabled }) => {
    if (javaScriptEnabled) await page.clock.install();
    await page.goto(language.path);
    const demo = page.getByRole('region', { name: language.label, exact: true });
    await expect(demo.getByText(language.success, { exact: true })).toBeVisible();
    await expect(demo.getByText(language.account, { exact: true })).toBeVisible();
    await expect(demo.getByRole('img')).toHaveAccessibleName(/Studio Luma.*Mara Luca.*300 MDL/);
    if (javaScriptEnabled) {
      await page.clock.runFor(30000);
      await expect(demo.getByText('8 / 8', { exact: true })).toBeVisible();
    }
    await demo.getByText(language.steps, { exact: true }).click();
    await expect(demo.getByRole('listitem')).toHaveCount(8);
    await expect(demo.getByRole('list')).toContainText('14:30');
    if (!javaScriptEnabled) {
      await expect(demo.getByRole('button')).toHaveCount(0);
    } else {
      await expect(demo.getByRole('button', { name: language.pause, exact: true })).toHaveCount(0);
      await demo.getByRole('button', { name: language.replay, exact: true }).click();
      await page.clock.runFor(30000);
      await expect(demo.getByText('1 / 8', { exact: true })).toBeVisible();
      await demo.getByRole('button', { name: language.next, exact: true }).click();
      await expect(demo.getByText('2 / 8', { exact: true })).toBeVisible();
      expect(await demo.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    }
  });
}
