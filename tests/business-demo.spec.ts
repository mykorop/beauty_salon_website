import { expect, test } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
import { consentText } from './support/consent-text';
import { homePath, locales, type Locale } from './support/public-pages';

const demos = {
  ro: { label: 'Demonstrație de calendar Business', clientLabel: 'Demonstrație de programare', pause: 'Pauză', resume: 'Continuă', replay: 'Repetă', next: 'Pasul următor', steps: 'Toți pașii, pe scurt', service: 'Manichiură', status: 'Confirmată' },
  en: { label: 'Business calendar demo', clientLabel: 'Booking demo', pause: 'Pause', resume: 'Resume', replay: 'Replay', next: 'Next step', steps: 'Read all the steps', service: 'Manicure', status: 'Confirmed' },
} satisfies Record<Locale, Record<string, string>>;
const languages = locales.map((locale) => ({ path: homePath(locale), understood: consentText[locale].understood, ...demos[locale] }));

test.describe('business calendar playback', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 1100 } });

  test('period changes, client search and clearing change the visible appointments', async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled, 'Playback needs JavaScript; static content is covered separately.');
    await page.clock.install();
    await page.goto('/en/');
    const demo = page.getByRole('region', { name: 'Business calendar demo', exact: true });
    const visible = (value: string) => demo.getByText(value, { exact: true }).filter({ visible: true });
    await page.clock.runFor(30000);
    await expect(demo.getByRole('img')).not.toBeInViewport();
    await expect(visible('6 / 6')).toBeVisible();
    await demo.getByRole('img').scrollIntoViewIfNeeded();
    await expect(visible('1 / 6')).toBeVisible();
    await expect(visible('Ana Demo')).toBeVisible();
    await expect(visible('Daria Demo')).toHaveCount(0);
    await expect(visible('Irina Demo')).toHaveCount(0);
    await page.clock.runFor(2600);
    await expect(visible('2 / 6')).toBeVisible();
    await expect(visible('This week')).toBeVisible();
    await expect(visible('Daria Demo')).toBeVisible();
    await expect(visible('Irina Demo')).toHaveCount(0);
    await page.clock.runFor(2800);
    await expect(visible('3 / 6')).toBeVisible();
    await expect(visible('This month')).toBeVisible();
    await expect(visible('Irina Demo')).toBeVisible();
    await page.clock.runFor(3200);
    await expect(visible('4 / 6')).toBeVisible();
    await expect(visible('Ana Demo')).toHaveCount(2); // Search query and matching card.
    await expect(visible('Daria Demo')).toHaveCount(0);
    await expect(visible('Irina Demo')).toHaveCount(0);
    await page.clock.runFor(2600);
    await expect(visible('5 / 6')).toBeVisible();
    for (const value of ['Manicure', 'Mara Luca', '14:30 (1 h)', '300 MDL', 'Confirmed']) await expect(visible(value)).toBeVisible();
    await page.clock.runFor(3800);
    await expect(visible('6 / 6')).toBeVisible();
    await expect(visible('Client, master, service')).toBeVisible();
    for (const value of ['Ana Demo', 'Daria Demo', 'Irina Demo']) await expect(visible(value)).toBeVisible();
    await page.clock.runFor(30000);
    await expect(visible('6 / 6')).toBeVisible();
  });

  for (const language of languages) {
    test(`playback controls and automatic pauses stay independent on ${language.path}`, async ({ page, javaScriptEnabled }) => {
      test.skip(!javaScriptEnabled, 'Playback needs JavaScript.');
      await page.clock.install();
      await page.goto(language.path);
      // Dismiss the floating notice: clicked controls are scrolled above it, which can leave too little of the phone in view.
      const notice = page.locator('#cookie-notice');
      await notice.getByRole('button', { name: language.understood, exact: true }).click();
      await expect(notice).toBeHidden();
      const client = page.getByRole('region', { name: language.clientLabel, exact: true });
      const demo = page.getByRole('region', { name: language.label, exact: true });
      await client.getByRole('img').scrollIntoViewIfNeeded();
      await expect(client.getByText('1 / 8', { exact: true })).toBeVisible();
      await client.getByRole('button', { name: language.pause, exact: true }).click();
      await demo.getByRole('img').scrollIntoViewIfNeeded();
      await expect(demo.getByText('1 / 6', { exact: true })).toBeVisible();
      await page.clock.runFor(2600);
      await expect(demo.getByText('2 / 6', { exact: true })).toBeVisible();
      await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
      await expect(demo.getByRole('img')).not.toBeInViewport();
      await page.clock.runFor(30000);
      await expect(demo.getByText('2 / 6', { exact: true })).toBeVisible();
      await demo.getByRole('img').scrollIntoViewIfNeeded();
      await expect(demo.getByRole('img')).toBeInViewport({ ratio: 0.6 });
      await page.clock.runFor(2800);
      await expect(demo.getByText('3 / 6', { exact: true })).toBeVisible();
      await demo.getByRole('button', { name: language.pause, exact: true }).click();
      await page.clock.runFor(30000);
      await expect(demo.getByText('3 / 6', { exact: true })).toBeVisible();
      await client.getByRole('img').scrollIntoViewIfNeeded();
      await expect(client.getByText('1 / 8', { exact: true })).toBeVisible();
      await expect(client.getByRole('button', { name: language.resume, exact: true })).toBeVisible();
      await client.getByRole('button', { name: language.replay, exact: true }).click();
      await page.clock.runFor(2400);
      await expect(client.getByText('2 / 8', { exact: true })).toBeVisible();
      await demo.getByRole('img').scrollIntoViewIfNeeded();
      await page.clock.runFor(30000);
      await expect(demo.getByText('3 / 6', { exact: true })).toBeVisible();
      await expect(demo.getByRole('button', { name: language.resume, exact: true })).toBeVisible();
      await demo.getByRole('button', { name: language.resume, exact: true }).click();
      await page.clock.runFor(3200);
      await expect(demo.getByText('4 / 6', { exact: true })).toBeVisible();
      for (let repeat = 0; repeat < 3; repeat++) await demo.getByRole('button', { name: language.replay, exact: true }).click();
      await page.clock.runFor(2600);
      await expect(demo.getByText('2 / 6', { exact: true })).toBeVisible();
      await page.clock.runFor(12400);
      await expect(demo.getByText('6 / 6', { exact: true })).toBeVisible();
      await demo.getByRole('button', { name: language.replay, exact: true }).click();
      await expect(demo.getByText('1 / 6', { exact: true })).toBeVisible();
    });

    test(`tab visibility and a live reduced-motion change preserve control on ${language.path}`, async ({ page, javaScriptEnabled }) => {
      test.skip(!javaScriptEnabled, 'Playback needs JavaScript.');
      await page.clock.install();
      await page.goto(language.path);
      const demo = page.getByRole('region', { name: language.label, exact: true });
      await demo.getByRole('img').scrollIntoViewIfNeeded();
      await expect(demo.getByText('1 / 6', { exact: true })).toBeVisible();
      // Browser visibility is the external boundary, not animator state.
      const setHidden = async (hidden: boolean) => page.evaluate(value => {
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => value });
        document.dispatchEvent(new Event('visibilitychange'));
      }, hidden);
      await setHidden(true);
      await page.clock.runFor(30000);
      await expect(demo.getByText('1 / 6', { exact: true })).toBeVisible();
      await setHidden(false);
      await page.clock.runFor(2600);
      await expect(demo.getByText('2 / 6', { exact: true })).toBeVisible();
      await demo.getByRole('button', { name: language.pause, exact: true }).click();
      await setHidden(true);
      await page.clock.runFor(30000);
      await setHidden(false);
      await page.clock.runFor(30000);
      await expect(demo.getByText('2 / 6', { exact: true })).toBeVisible();
      await demo.getByRole('button', { name: language.resume, exact: true }).click();
      await demo.getByRole('button', { name: language.pause, exact: true }).focus();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(demo.getByRole('button', { name: language.replay, exact: true })).toBeFocused();
      await expect(demo.getByText('6 / 6', { exact: true })).toBeVisible();
      await demo.getByRole('button', { name: language.replay, exact: true }).click();
      await page.clock.runFor(30000);
      await expect(demo.getByText('1 / 6', { exact: true })).toBeVisible();
      await demo.getByRole('button', { name: language.next, exact: true }).click();
      await expect(demo.getByText('2 / 6', { exact: true })).toBeVisible();
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.clock.runFor(30000);
      await expect(demo.getByText('2 / 6', { exact: true })).toBeVisible();
      await expect(demo.getByRole('button', { name: language.resume, exact: true })).toBeVisible();
    });

    test(`keyboard playback and initial, paused and final axe scans on ${language.path}`, async ({ page, javaScriptEnabled, tabKey }) => {
      test.skip(!javaScriptEnabled, 'axe and playback need JavaScript.');
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
      await page.goto(language.path);
      const demo = page.getByRole('region', { name: language.label, exact: true });
      await demo.getByRole('img').scrollIntoViewIfNeeded();
      await expect(demo.getByText('1 / 6', { exact: true })).toBeVisible();
      const description = await demo.getByRole('img').getAttribute('aria-label');
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.locator('#business a[href="#download-business"]').focus();
      await page.keyboard.press(tabKey);
      await expect(demo.getByRole('button', { name: language.pause, exact: true })).toBeFocused();
      await expect(page.locator(':focus')).toHaveCSS('outline-width', '3px');
      await page.keyboard.press('Enter');
      await expect(demo.getByRole('button', { name: language.resume, exact: true })).toBeFocused();
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.keyboard.press('Space');
      await page.keyboard.press(tabKey);
      await expect(demo.getByRole('button', { name: language.replay, exact: true })).toBeFocused();
      await page.keyboard.press('Enter');
      await demo.getByRole('img').scrollIntoViewIfNeeded();
      await page.clock.runFor(15000);
      await expect(demo.getByText('6 / 6', { exact: true })).toBeVisible();
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await expect(demo.getByRole('img')).toHaveAttribute('aria-label', description!);
      await expect(demo.getByRole('textbox')).toHaveCount(0);
      await expect(demo.getByRole('combobox')).toHaveCount(0);
      await expect(demo.locator('[aria-live]')).toHaveCount(0);
      await expect(demo.locator('iframe, audio, video')).toHaveCount(0);
      expect(requests).toEqual([]);
      await expect(page.locator('html')).not.toHaveAttribute('data-permission-requested');
    });
  }

  test('active demos leave scrolling, FAQ, contact and language navigation usable', async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled, 'Active playback needs JavaScript; native site controls are covered separately.');
    await page.route('https://formbold.com/s/oD7mJ', route => route.fulfill({ json: { success: true } }));
    await page.clock.install();
    await page.goto('/en/');
    const demo = page.getByRole('region', { name: 'Business calendar demo', exact: true });
    await demo.getByRole('img').scrollIntoViewIfNeeded();
    await expect(demo.getByText('1 / 6', { exact: true })).toBeVisible();
    const scrollPosition = await page.evaluate(() => scrollY);
    await page.clock.runFor(2600);
    expect(await page.evaluate(() => scrollY)).toBe(scrollPosition);
    const faq = page.getByRole('region', { name: 'Frequently asked questions', exact: true });
    await faq.getByText('Which app should I choose?', { exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(faq.getByText(/BookMe Business.*BookMe Salon/)).toBeVisible();
    await page.getByRole('textbox', { name: 'Your name', exact: true }).fill('Demo visitor');
    await page.getByRole('textbox', { name: 'Email address', exact: true }).fill('demo@example.test');
    await page.getByRole('textbox', { name: 'How can we help?', exact: true }).fill('Local intercepted check');
    await page.getByRole('button', { name: 'Send message', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('Your message has been sent. Thank you for contacting BookMe!');
    await page.locator('header').getByRole('link', { name: 'Română', exact: true }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('region', { name: languages[0].label, exact: true })).toBeVisible();
  });
});

test('the static business calendar shows fictional appointments and explains every step', async ({ page }) => {
  await page.goto('/en/');
  const demo = page.getByRole('region', { name: 'Business calendar demo', exact: true });
  await expect(demo.getByRole('img')).toHaveAccessibleName(/Illustrative.*Ana Demo.*Mara Luca.*300 MDL/);
  for (const value of ['Ana Demo', 'Daria Demo', 'Irina Demo', 'Manicure', '14:30 (1 h)', '300 MDL']) {
    await expect(demo.getByText(value, { exact: true }).filter({ visible: true })).toBeVisible();
  }
  await expect(demo).toContainText('independent');
  await expect(demo).toContainText('not live-synced');
  await demo.getByText('Read all the steps', { exact: true }).click();
  await expect(demo.getByRole('listitem')).toHaveCount(6);
  await expect(demo.getByRole('list')).toContainText('15 October 2026');
});

for (const language of languages) {
  test(`all business frames pass axe and match the client appointment on ${language.path}`, async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled, 'axe requires JavaScript.');
    await page.goto(language.path);
    const client = page.getByRole('region', { name: language.clientLabel, exact: true });
    const demo = page.getByRole('region', { name: language.label, exact: true });
    await demo.getByRole('button', { name: language.replay, exact: true }).click();
    for (const value of [language.service, 'Mara Luca', '14:30 (1 h)', '300 MDL']) {
      await expect(client.getByText(value, { exact: true }).filter({ visible: true })).toBeVisible();
      await expect(demo.getByText(value, { exact: true }).filter({ visible: true })).toBeVisible();
    }
    for (let frame = 1; frame <= 6; frame++) {
      await expect(demo.getByText(`${frame} / 6`, { exact: true })).toBeVisible();
      expect((await new AxeBuilder({ page }).analyze()).violations, `Frame ${frame}`).toEqual([]);
      if (frame < 6) await demo.getByRole('button', { name: language.next, exact: true }).click();
    }
  });

  for (const width of [320, 768, 1440]) {
    test(`business frames and controls fit ${width}px on ${language.path}`, async ({ page, javaScriptEnabled }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(language.path);
      const demo = page.getByRole('region', { name: language.label, exact: true });
      if (javaScriptEnabled) {
        // Dismiss the floating notice before checking the illustration for occluded text.
        const notice = page.locator('#cookie-notice');
        await notice.getByRole('button', { name: language.understood, exact: true }).click();
        await expect(notice).toBeHidden();
        await demo.getByRole('button', { name: language.replay, exact: true }).click();
      }
      for (let frame = javaScriptEnabled ? 1 : 6; frame <= 6; frame++) {
        await expect(demo.getByText(`${frame} / 6`, { exact: true })).toBeVisible();
        await demo.getByRole('img').scrollIntoViewIfNeeded();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        const clippedText = await demo.getByRole('img').evaluate(element => {
          const boundary = element.getBoundingClientRect();
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          const clipped: string[] = [];
          while (walker.nextNode()) {
            if (!walker.currentNode.textContent?.trim()) continue;
            const range = document.createRange();
            range.selectNode(walker.currentNode);
            for (const box of range.getClientRects()) {
              if (!box.width || !box.height) continue;
              const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
              if (box.left < boundary.left || box.right > boundary.right || box.top < boundary.top || box.bottom > boundary.bottom || !walker.currentNode.parentElement?.contains(hit)) clipped.push(walker.currentNode.textContent);
            }
          }
          return clipped;
        });
        expect(clippedText).toEqual([]);
        if (javaScriptEnabled && frame < 6) await demo.getByRole('button', { name: language.next, exact: true }).click();
      }
    });
  }

  test(`static and reduced-motion business visitors can read every step on ${language.path}`, async ({ page, javaScriptEnabled }) => {
    if (javaScriptEnabled) await page.clock.install();
    await page.goto(language.path);
    const demo = page.getByRole('region', { name: language.label, exact: true });
    await demo.getByRole('img').scrollIntoViewIfNeeded();
    if (javaScriptEnabled) await page.clock.runFor(30000);
    await expect(demo.getByText('6 / 6', { exact: true })).toBeVisible();
    for (const client of ['Ana Demo', 'Daria Demo', 'Irina Demo']) await expect(demo.getByText(client, { exact: true }).filter({ visible: true })).toBeVisible();
    await expect(demo.getByRole('img')).toHaveAccessibleName(/Ana Demo.*Mara Luca.*300 MDL/);
    await demo.getByText(language.steps, { exact: true }).click();
    await expect(demo.getByRole('listitem')).toHaveCount(6);
    await expect(demo.getByRole('list')).toContainText('14:30');
    await expect(demo.getByRole('button', { name: language.pause, exact: true })).toHaveCount(0);
    if (!javaScriptEnabled) {
      await expect(demo.getByRole('button')).toHaveCount(0);
    } else {
      await demo.getByRole('button', { name: language.replay, exact: true }).click();
      await page.clock.runFor(30000);
      await expect(demo.getByText('1 / 6', { exact: true })).toBeVisible();
      await demo.getByRole('button', { name: language.next, exact: true }).click();
      await expect(demo.getByText('2 / 6', { exact: true })).toBeVisible();
      expect(await demo.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    }
  });
}
