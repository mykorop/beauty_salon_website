import { expect, test } from './fixtures';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { consentText, policyHeading } from './support/consent-text';
import { homePath, indexablePages, languageNames, linkLocale, locales } from './support/public-pages';

for (const { locale, path } of indexablePages) {
  test(`notice and storage inventory on ${path}`, async ({ page, javaScriptEnabled }, testInfo) => {
    // A choice made in one language must hold in the next one, wrapping around the list.
    const next = locales[(locales.indexOf(locale) + 1) % locales.length];
    const text = consentText[locale];
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const banner = page.getByRole('region', { name: text.banner });
    await expect(banner).toContainText(text.intro);
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('BODY');
    const inventory = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage }, cookies: document.cookie, scripts: [...document.scripts].map((script) => script.src || script.type), connections: [...document.querySelectorAll('link[rel="preconnect"], link[rel="dns-prefetch"], iframe')].map((node) => node.outerHTML) }));
    expect(inventory.local).toEqual({});
    expect(inventory.session).toEqual({});
    expect(inventory.cookies).toBe('');
    expect(inventory.connections).toEqual([]);
    expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4329')).toBe(true);
    await mkdir('reports/consent-inventory', { recursive: true });
    await writeFile(`reports/consent-inventory/${testInfo.project.name}-${path.replaceAll('/', '_') || 'home'}.json`, JSON.stringify({ path, requests, ...inventory }, null, 2));
    if (!javaScriptEnabled) {
      await expect(banner.getByRole('button')).toHaveCount(0);
      await expect(banner.getByText(text.noJs)).toBeVisible();
    } else {
      await banner.getByRole('button', { name: text.understood, exact: true }).click();
      await expect(banner).toBeHidden();
      const stored = await page.evaluate(() => ({ ...localStorage }));
      expect(Object.keys(stored)).toEqual(['bookme.cookie-consent']);
      const record = JSON.parse(stored['bookme.cookie-consent']);
      expect(record).toEqual({ schemaVersion: 1, noticeVersion: '2026-09-18:none', choice: 'acknowledged', actedAt: expect.any(Number), expiresAt: expect.any(Number) });
      expect(record.expiresAt - record.actedAt).toBe(15_552_000_000);
      await page.getByRole('link', { name: languageNames[next], exact: true }).click();
      await expect(page.getByRole('region', { name: consentText[next].banner })).toBeHidden();
      expect(await page.evaluate(() => localStorage.getItem('bookme.cookie-consent'))).toBe(stored['bookme.cookie-consent']);
    }
    // With JavaScript the visitor is now on the next language's page.
    const shown = consentText[javaScriptEnabled ? next : locale];
    const footer = page.getByRole('contentinfo');
    await footer.getByRole('link', { name: shown.settings }).click();
    if (javaScriptEnabled) {
      await expect(page.getByRole('dialog')).toContainText(shown.acknowledged);
      await page.getByRole('dialog').getByRole('link', { name: shown.policyLink }).click();
    }
    // The policy's cookie section, in the default language until the policy is translated.
    await expect(page.getByRole('heading', { name: policyHeading[linkLocale(javaScriptEnabled ? next : locale, 'privacy')], exact: true })).toBeInViewport();
  });
}

for (const locale of locales) {
  test(`the cookie choice covers every language version of this site but not the web versions in ${locale}`, async ({ page, javaScriptEnabled }) => {
    const text = consentText[locale];
    // The policy is in the default language until it is translated.
    const policy = consentText[linkLocale(locale, 'privacy')];
    await page.goto(homePath(locale));
    await page.getByRole('contentinfo').getByRole('link', { name: text.settings }).click();
    if (javaScriptEnabled) {
      const settings = page.getByRole('dialog', { name: text.settings });
      await expect(settings).toContainText(text.scope);
      await expect(settings).toContainText(text.notShared);
      await settings.getByRole('link', { name: text.policyLink }).click();
    }
    // Without JavaScript the settings link opens the policy's cookie section instead of the dialog.
    await expect(page.getByRole('main')).toContainText(policy.scope);
    await expect(page.getByRole('main')).toContainText(policy.notShared);
  });
}

for (const invalid of ['corrupt', 'expired', 'version', 'schema']) {
  test(`an ${invalid} acknowledgement brings back the notice`, async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled);
    await page.goto('/en/');
    await page.getByRole('button', { name: 'Understood', exact: true }).click();
    await page.evaluate((invalid) => {
      const key = 'bookme.cookie-consent';
      const record = JSON.parse(localStorage.getItem(key)!);
      if (invalid === 'corrupt') return localStorage.setItem(key, 'bad-json');
      if (invalid === 'expired') { record.actedAt -= 15_552_000_000; record.expiresAt -= 15_552_000_000; }
      if (invalid === 'version') record.noticeVersion = 'old';
      if (invalid === 'schema') record.schemaVersion = 2;
      localStorage.setItem(key, JSON.stringify(record));
    }, invalid);
    await page.reload();
    await expect(page.getByRole('button', { name: 'Understood', exact: true })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('bookme.cookie-consent'))).toBeNull();
  });
}

for (const method of ['getItem', 'setItem']) {
  test(`unavailable ${method} shows an honest error and permits page-only dismissal`, async ({ page, javaScriptEnabled }) => {
    test.skip(!javaScriptEnabled);
    await page.addInitScript((method) => { Object.defineProperty(Storage.prototype, method, { value() { throw new DOMException('Blocked', 'SecurityError'); } }); }, method);
    await page.goto('/en/');
    await page.getByRole('button', { name: 'Understood', exact: true }).click();
    const banner = page.getByRole('region', { name: 'Cookies and your privacy' });
    await expect(banner).toContainText('We could not save or read your choice');
    await banner.getByRole('button', { name: 'Dismiss for this page' }).click();
    await expect(banner).toBeHidden();
    await page.reload();
    await expect(banner).toBeVisible();
  });
}

test('the publishable artifact contains no controlled provider or test endpoint', async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  const files = await readdir('dist', { recursive: true });
  for (const file of files.filter((file) => /\.(js|html)$/.test(file))) {
    expect(await readFile(`dist/${file}`, 'utf8'), file).not.toMatch(/consent-test\.invalid|controlled-test-provider|bookme\.test-analytics|Controlled test analytics|Analiză controlată de test|Контролируемая тестовая аналитика/);
  }
});

test('visitor can acknowledge the notice and reopen the saved choice', async ({ page, javaScriptEnabled }, testInfo) => {
  test.skip(!javaScriptEnabled, 'The static explanation is covered separately.');
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/en/');
  await page.waitForLoadState('networkidle');
  await testInfo.attach('initial-browser-inventory', {
    body: JSON.stringify({ requests, storage: await page.evaluate(() => ({
      local: { ...localStorage }, session: { ...sessionStorage }, cookies: document.cookie,
      scripts: [...document.scripts].map((script) => script.src || script.type),
      connections: [...document.querySelectorAll('link[rel="preconnect"], iframe')].map((node) => node.outerHTML),
    })) }, null, 2), contentType: 'application/json',
  });
  const notice = page.getByRole('region', { name: 'Cookies and your privacy' });
  await expect(notice).toContainText('Analytics is not connected');
  await expect(notice.getByRole('button', { name: 'Allow analytics' })).toHaveCount(0);
  await notice.getByRole('button', { name: 'Understood', exact: true }).click();
  await expect(notice).toBeHidden();
  await page.reload();
  await expect(notice).toBeHidden();
  await page.getByRole('contentinfo').getByRole('link', { name: 'Cookie settings' }).click();
  const settings = page.getByRole('dialog', { name: 'Cookie settings' });
  await expect(settings).toContainText('Notice acknowledged');
  await expect(settings.getByRole('checkbox', { name: 'Analytics', exact: true })).toBeDisabled();
  await expect(settings.getByRole('checkbox', { name: 'Analytics', exact: true })).not.toBeChecked();
});
