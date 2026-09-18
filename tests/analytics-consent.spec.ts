import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

const key = 'bookme.cookie-consent';
const settings = (page: Page) => page.getByRole('contentinfo').getByRole('link', { name: 'Cookie settings' });
async function consentRecord(page: Page) { return page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key); }
async function interceptAnalytics(page: Page) {
  const requests: string[] = [];
  await page.route('https://consent-test.invalid/**', (route) => {
    requests.push(new URL(route.request().url()).pathname);
    return route.fulfill({ status: 200, body: 'synthetic' });
  });
  return requests;
}

for (const invalid of ['corrupt', 'expired', 'schema', 'notice', 'purpose', 'provider', 'acknowledgement', 'cleared']) {
  test(`${invalid} consent is rejected before collecting in a new document`, async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled);
    const requests = await interceptAnalytics(page);
    await page.goto('/en/');
    await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
    await expect.poll(() => requests.includes('/event')).toBe(true);
    await page.evaluate(({ key, invalid }) => {
      const record = JSON.parse(localStorage.getItem(key)!);
      if (invalid === 'corrupt') return localStorage.setItem(key, '{broken');
      if (invalid === 'cleared') return localStorage.removeItem(key);
      if (invalid === 'expired') { record.actedAt -= 15_552_000_000; record.expiresAt -= 15_552_000_000; }
      if (invalid === 'schema') record.schemaVersion = 99;
      if (['notice', 'purpose', 'provider'].includes(invalid)) record.noticeVersion += `-${invalid}-changed`;
      if (invalid === 'acknowledgement') { record.choice = 'acknowledged'; record.noticeVersion = '2026-09-18:none'; }
      localStorage.setItem(key, JSON.stringify(record));
    }, { key, invalid });
    requests.length = 0;
    await page.reload();
    await expect(page.getByRole('button', { name: 'Allow analytics', exact: true })).toBeVisible();
    await page.waitForTimeout(1100);
    expect(requests).toEqual([]);
    expect(await page.evaluate(() => localStorage.getItem('bookme.test-analytics'))).toBeNull();
    await settings(page).click();
    await expect(page.getByRole('checkbox')).not.toBeChecked();
    await expect(page.getByRole('dialog')).toContainText('No saved choice');
  });
}

test('permission survives reload and language changes without duplicate starts or extending the term', async ({ page, javaScriptEnabled }) => {
  test.skip(!javaScriptEnabled);
  const requests = await interceptAnalytics(page);
  await page.goto('/en/');
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  await expect.poll(() => requests.includes('/event')).toBe(true);
  const original = await consentRecord(page);
  await settings(page).click();
  await expect(page.getByRole('checkbox')).toBeChecked();
  await page.getByRole('checkbox').uncheck();
  await page.getByRole('button', { name: 'Close without saving' }).click();
  await settings(page).click();
  await expect(page.getByRole('checkbox')).toBeChecked();
  await page.keyboard.press('Escape');
  expect(requests.filter((path) => path === '/sdk')).toHaveLength(1);
  expect(await consentRecord(page)).toEqual(original);
  await page.reload();
  await expect.poll(() => requests.filter((path) => path === '/sdk').length).toBe(2);
  await page.getByRole('link', { name: 'Română', exact: true }).click();
  await expect.poll(() => requests.filter((path) => path === '/sdk').length).toBe(3);
  await page.getByRole('contentinfo').getByRole('link', { name: 'Setări cookie' }).click();
  await expect(page.getByRole('checkbox')).toBeChecked();
  await expect(page.getByRole('dialog')).toContainText('Analiză permisă');
  expect(await consentRecord(page)).toEqual(original);
});

test('another tab can revoke consent and browser history checks the current choice', async ({ page, context, javaScriptEnabled }) => {
  test.skip(!javaScriptEnabled);
  const requests = await interceptAnalytics(page);
  await page.goto('/en/');
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  await expect.poll(() => requests.includes('/event')).toBe(true);
  const second = await context.newPage();
  await second.route('**/*', (route) => new URL(route.request().url()).origin === 'http://127.0.0.1:4329' ? route.continue() : route.fulfill({ status: 200, body: 'synthetic' }));
  await second.goto('/en/privacy.html');
  await settings(second).click();
  await second.getByRole('checkbox').uncheck();
  await second.getByRole('button', { name: 'Save choice' }).click();
  await settings(page).click();
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await expect(page.getByRole('dialog')).toContainText('Necessary only');
  const count = requests.length;
  await page.waitForTimeout(1100);
  expect(requests).toHaveLength(count);
  await page.keyboard.press('Escape');
  await page.getByRole('contentinfo').getByRole('link', { name: 'Privacy Policy', exact: true }).click();
  await second.evaluate(() => localStorage.clear());
  await page.goBack();
  await expect(page.getByRole('button', { name: 'Allow analytics', exact: true })).toBeVisible();
  expect(requests).toHaveLength(count);
  await second.close();
});

test('a suspended page cannot restart on visibility changes and rechecks permission on restoration', async ({ page, javaScriptEnabled }) => {
  test.skip(!javaScriptEnabled);
  const requests = await interceptAnalytics(page);
  await page.goto('/en/');
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  await expect.poll(() => requests.includes('/event')).toBe(true);
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const count = requests.length;
  await page.waitForTimeout(1100);
  expect(requests).toHaveLength(count);
  await page.evaluate(() => {
    localStorage.removeItem('bookme.cookie-consent');
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await expect(page.getByRole('button', { name: 'Allow analytics', exact: true })).toBeVisible();
  await page.waitForTimeout(1100);
  expect(requests).toHaveLength(count);
});

test('inaction, scrolling, policy navigation and closing an edited draft never permit analytics', async ({ page, javaScriptEnabled }) => {
  test.skip(!javaScriptEnabled);
  const requests = await interceptAnalytics(page);
  await page.goto('/en/');
  await page.mouse.wheel(0, 1200);
  await settings(page).click();
  await page.getByRole('checkbox').check();
  await page.keyboard.press('Escape');
  await settings(page).click();
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await page.getByRole('dialog').getByRole('link', { name: 'Cookies in the Privacy Policy' }).click();
  await expect(page.getByRole('heading', { name: 'Cookies and similar technologies', exact: true })).toBeInViewport();
  await page.getByRole('link', { name: 'Română', exact: true }).click();
  await page.waitForTimeout(1100);
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual({});
  expect(await page.context().cookies()).toEqual([]);
});

test('denying analytics preserves FAQ, web links and a mocked contact submission', async ({ page, javaScriptEnabled }) => {
  test.skip(!javaScriptEnabled);
  const requests = await interceptAnalytics(page);
  let submissions = 0;
  await page.route('https://formbold.com/s/oD7mJ', (route) => { submissions++; return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }); });
  await page.goto('/en/');
  await page.getByRole('button', { name: 'Necessary only', exact: true }).click();
  await page.locator('summary').first().click();
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await expect(page.getByRole('link', { name: 'Open web app', exact: true }).first()).toHaveAttribute('href', 'https://app.bookme.md/');
  await page.getByRole('textbox', { name: 'Your name', exact: true }).fill('Consent test');
  await page.getByRole('textbox', { name: 'Email address', exact: true }).fill('consent@example.com');
  expect(submissions).toBe(0);
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Your message has been sent');
  expect(submissions).toBe(1);
  expect(requests).toEqual([]);
});

test('a late provider response cannot restart collection after withdrawal', async ({ page, javaScriptEnabled }) => {
  test.skip(!javaScriptEnabled);
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  let loads = 0;
  let events = 0;
  await page.route('https://consent-test.invalid/sdk', async (route) => {
    loads++;
    await gate;
    await route.fulfill({ status: 200, body: 'delayed SDK' }).catch(() => {});
  });
  await page.route('https://consent-test.invalid/event', (route) => { events++; return route.fulfill({ status: 200 }); });
  await page.goto('/en/');
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  await expect.poll(() => loads).toBe(1);
  await settings(page).click();
  await page.getByRole('checkbox').uncheck();
  await page.getByRole('button', { name: 'Save choice' }).click();
  release();
  await page.waitForTimeout(1200);
  expect(events).toBe(0);
  expect(await page.evaluate(() => localStorage.getItem('bookme.test-analytics'))).toBeNull();
  await settings(page).click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Save choice' }).click();
  await expect.poll(() => loads).toBe(2);
  await expect.poll(() => events).toBeGreaterThan(0);
});

test('withdrawal clears accessible analytics data even when one storage entry cannot be removed', async ({ page, javaScriptEnabled }) => {
  test.skip(!javaScriptEnabled);
  const requests = await interceptAnalytics(page);
  await page.goto('/en/');
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  await expect.poll(() => requests.includes('/event')).toBe(true);
  await settings(page).click();
  await page.getByRole('checkbox').uncheck();
  await page.evaluate(() => {
    const remove = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function (key) {
      if (this === localStorage && key === 'bookme.test-analytics') throw new DOMException('Removal blocked', 'SecurityError');
      remove.call(this, key);
    };
  });
  await page.getByRole('button', { name: 'Save choice' }).click();
  expect(await page.evaluate(() => ({ cookies: document.cookie, session: sessionStorage.getItem('bookme.test-session') }))).toEqual({ cookies: '', session: null });
  const count = requests.length;
  await page.waitForTimeout(1100);
  expect(requests).toHaveLength(count);
});

test('an open document expires consent at 180 days without extending it on reads', async ({ page, javaScriptEnabled }) => {
  test.skip(!javaScriptEnabled);
  const requests = await interceptAnalytics(page);
  await page.clock.install({ time: new Date('2026-09-18T09:00:00Z') });
  await page.clock.pauseAt(new Date('2026-09-18T09:00:01Z'));
  await page.goto('/en/');
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  await expect.poll(() => requests.includes('/event')).toBe(true);
  const original = await consentRecord(page);
  expect(original.expiresAt - original.actedAt).toBe(15_552_000_000);
  await settings(page).click();
  await page.keyboard.press('Escape');
  expect(await consentRecord(page)).toEqual(original);
  await page.clock.setSystemTime(new Date(original.expiresAt - 60_001));
  await page.clock.runFor(60_000);
  expect(await consentRecord(page)).toEqual(original);
  await page.clock.runFor(1);
  await expect(page.getByRole('button', { name: 'Allow analytics', exact: true })).toBeVisible();
  expect(await consentRecord(page)).toBeNull();
  const count = requests.length;
  await page.clock.fastForward(5000);
  expect(requests).toHaveLength(count);
  expect(await page.evaluate(() => localStorage.getItem('bookme.test-analytics'))).toBeNull();
});

for (const failure of ['read', 'write'] as const) {
  test(`storage ${failure} failure blocks consent and withdrawal still stops collection`, async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled);
    const requests = await interceptAnalytics(page);
    await page.goto('/en/');
    await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
    await expect.poll(() => requests.includes('/event')).toBe(true);
    await settings(page).click();
    await page.getByRole('checkbox').uncheck();
    await page.evaluate((failure) => {
      Storage.prototype[failure === 'read' ? 'getItem' : 'setItem'] = () => { throw new DOMException('Unavailable', 'SecurityError'); };
    }, failure);
    await page.getByRole('button', { name: 'Save choice' }).click();
    await expect(page.getByRole('dialog')).toContainText('We could not save or read your choice');
    const count = requests.length;
    await page.waitForTimeout(1200);
    expect(requests).toHaveLength(count);
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Save choice' }).click();
    expect(requests).toHaveLength(count);
    await expect(page.getByRole('dialog')).toBeVisible();
    expect(await page.evaluate(() => document.cookie)).toBe('');
  });
}

test('analytics starts only after permission and stops with selective cleanup on withdrawal', async ({ page, javaScriptEnabled }) => {
  test.skip(!javaScriptEnabled);
  const requests = await interceptAnalytics(page);
  await page.goto('/en/');
  await page.evaluate(() => {
    localStorage.setItem('unrelated-preference', 'keep');
    sessionStorage.setItem('unrelated-session', 'keep');
    document.cookie = 'site_preference=keep; Path=/; SameSite=Lax';
  });
  const banner = page.getByRole('region', { name: 'Cookies and your privacy' });
  await banner.getByRole('button', { name: 'Settings', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Controlled test analytics');
  await expect(dialog.getByRole('checkbox')).not.toBeChecked();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1100);
  expect(requests).toEqual([]);
  await banner.getByRole('button', { name: 'Necessary only', exact: true }).click();
  await page.reload();
  expect(requests).toEqual([]);
  await page.getByRole('contentinfo').getByRole('link', { name: 'Cookie settings' }).click();
  await dialog.getByRole('checkbox').check();
  await dialog.getByRole('button', { name: 'Save choice' }).click();
  await expect.poll(() => requests.filter((path) => path === '/sdk').length).toBe(1);
  await expect.poll(() => requests.includes('/event')).toBe(true);
  expect(await page.evaluate(() => localStorage.getItem('bookme.test-analytics'))).toBe('synthetic');
  await page.getByRole('contentinfo').getByRole('link', { name: 'Cookie settings' }).click();
  await dialog.getByRole('checkbox').uncheck();
  await dialog.getByRole('button', { name: 'Save choice' }).click();
  const stoppedAt = requests.length;
  await page.waitForTimeout(1200);
  expect(requests).toHaveLength(stoppedAt);
  expect(await page.evaluate(() => ({ local: localStorage.getItem('bookme.test-analytics'), session: sessionStorage.getItem('bookme.test-session'), cookies: document.cookie, other: localStorage.getItem('unrelated-preference'), otherSession: sessionStorage.getItem('unrelated-session') }))).toEqual({ local: null, session: null, cookies: 'site_preference=keep', other: 'keep', otherSession: 'keep' });
});
