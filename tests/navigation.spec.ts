import { expect, test } from '@playwright/test';

for (const filename of ['index.html', 'privacy.html', 'terms.html', 'delete-account.html']) {
  test(`language switch keeps the visitor on ${filename}`, async ({ page }) => {
    await page.goto(`/${filename}`);
    await page.getByRole('link', { name: 'English', exact: true }).click();
    const suffix = filename === 'index.html' ? '' : filename;
    await expect(page).toHaveURL(`/en/${suffix}`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: 'English', exact: true })).toHaveAttribute('aria-current', 'page');

    await page.getByRole('link', { name: 'Română', exact: true }).click();
    await expect(page).toHaveURL(`/${suffix}`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
    await expect(page.getByRole('link', { name: 'Română', exact: true })).toHaveAttribute('aria-current', 'page');
  });
}

for (const language of [
  { prefix: '/', nav: 'Navigare principală', how: 'Cum funcționează', features: 'Funcționalități', privacy: 'Confidențialitate', terms: 'Condiții', deletion: 'Ștergerea contului' },
  { prefix: '/en/', nav: 'Main navigation', how: 'How it works', features: 'Features', privacy: 'Privacy', terms: 'Terms', deletion: 'Delete your account' },
]) {
  test(`navigation reaches homepage sections and all legal pages in ${language.prefix}`, async ({ page }) => {
    await page.goto(`${language.prefix}privacy.html`);
    const navigation = page.getByRole('navigation', { name: language.nav });
    for (const [name, id] of [[language.how, 'how-it-works'], [language.features, 'features'], ['Contact', 'contact']]) {
      await navigation.getByRole('link', { name, exact: true }).click();
      await expect(page).toHaveURL(`${language.prefix}#${id}`);
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
    await navigation.getByRole('link', { name: language.privacy, exact: true }).click();
    await expect(page).toHaveURL(`${language.prefix}privacy.html`);
    await navigation.getByRole('link', { name: language.terms, exact: true }).click();
    await expect(page).toHaveURL(`${language.prefix}terms.html`);
    await page.getByRole('contentinfo').getByRole('link', { name: language.deletion }).click();
    await expect(page).toHaveURL(`${language.prefix}delete-account.html`);
    await page.getByRole('link', { name: 'BookMe', exact: true }).click();
    await expect(page).toHaveURL(language.prefix);
  });
}

test('keyboard users can skip to content and follow visible menu links', async ({ page }) => {
  await page.goto('/terms.html');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Sari la conținut' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await expect(skip).toHaveCSS('outline-style', 'solid');
  await expect(skip).toHaveCSS('outline-width', '3px');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();

  await page.goto('/terms.html');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const how = page.getByRole('navigation', { name: 'Navigare principală' }).getByRole('link', { name: 'Cum funcționează' });
  await expect(how).toBeFocused();
  await expect(how).toBeInViewport();
  await expect(how).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/#how-it-works');
});

test('pages fit a 320px screen and load Romanian fonts from the same origin', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  const fontRequests: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'font') fontRequests.push(request.url());
  });
  for (const path of ['/', '/privacy.html', '/terms.html', '/delete-account.html', '/en/', '/en/privacy.html', '/en/terms.html', '/en/delete-account.html']) {
    await page.goto(path);
    const widths = await page.evaluate(async () => {
      await document.fonts.ready;
      return { content: document.documentElement.scrollWidth, viewport: window.innerWidth };
    });
    expect(widths.content, path).toBeLessThanOrEqual(widths.viewport);
  }
  expect(fontRequests.some((url) => url.includes('dm-sans-latin-ext'))).toBe(true);
  expect(fontRequests.some((url) => url.includes('instrument-serif-latin-ext'))).toBe(true);
  for (const url of fontRequests) expect(new URL(url).origin).toBe('http://127.0.0.1:4329');
});
