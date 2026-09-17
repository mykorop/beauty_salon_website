import { expect, test } from './fixtures';

const pages = [
  { path: '/index.html', url: '/', locale: 'ro', title: 'BookMe — Programări la salon în Moldova', description: /platforma gratuită.*Moldova/ },
  { path: '/privacy.html', url: '/privacy.html', locale: 'ro', title: 'Politica de confidențialitate — BookMe', description: /datele personale/ },
  { path: '/terms.html', url: '/terms.html', locale: 'ro', title: 'Condiții de utilizare — BookMe', description: /Condițiile de utilizare.*clienți/ },
  { path: '/delete-account.html', url: '/delete-account.html', locale: 'ro', title: 'Șterge contul tău BookMe — BookMe', description: /ștergi contul/ },
  { path: '/en/index.html', url: '/en/', locale: 'en', title: 'BookMe — Beauty appointments in Moldova', description: /free.*Moldova/ },
  { path: '/en/privacy.html', url: '/en/privacy.html', locale: 'en', title: 'Privacy Policy — BookMe', description: /personal data/ },
  { path: '/en/terms.html', url: '/en/terms.html', locale: 'en', title: 'Terms of Use — BookMe', description: /Terms of use.*clients/ },
  { path: '/en/delete-account.html', url: '/en/delete-account.html', locale: 'en', title: 'Delete Your BookMe Account — BookMe', description: /delete your BookMe account/ },
];

for (const entry of pages) {
  test(`static branding and localized social cards are available at ${entry.path}`, async ({ page }) => {
    await page.goto(entry.path);
    const head = page.locator('head');
    await expect(head.locator('link[rel~="icon"]')).toHaveCount(2);
    for (const [selector, href, sizes] of [
      ['link[rel="icon"][type="image/x-icon"]', '/favicon.ico', '16x16 32x32 48x48'],
      ['link[rel="icon"][type="image/png"]', '/favicon-96x96.png', '96x96'],
      ['link[rel="apple-touch-icon"]', '/apple-touch-icon.png', '180x180'],
      ['link[rel="manifest"]', '/site.webmanifest', null],
    ] as const) {
      const link = head.locator(selector);
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('href', href);
      if (sizes) await expect(link).toHaveAttribute('sizes', sizes);
    }
    const description = head.locator('meta[name="description"]');
    await expect(description).toHaveCount(1);
    await expect(description).toHaveAttribute('content', entry.description);
    const image = `https://bookme.md/social/bookme-${entry.locale}.png`;
    const imageAlt = entry.locale === 'ro'
      ? 'BookMe — Programări la salon, în ritmul tău. Clienți, saloane și specialiști din Moldova.'
      : 'BookMe — Beauty appointments, at your pace. Clients, salons and professionals in Moldova.';
    for (const [key, value] of Object.entries({
      'og:type': 'website', 'og:site_name': 'BookMe', 'og:title': entry.title,
      'og:description': (await description.getAttribute('content'))!,
      'og:url': `https://bookme.md${entry.url}`,
      'og:locale': entry.locale === 'ro' ? 'ro_MD' : 'en_US',
      'og:locale:alternate': entry.locale === 'ro' ? 'en_US' : 'ro_MD',
      'og:image': image, 'og:image:type': 'image/png', 'og:image:width': '1200',
      'og:image:height': '630', 'og:image:alt': imageAlt,
      'twitter:card': 'summary_large_image', 'twitter:title': entry.title,
      'twitter:description': (await description.getAttribute('content'))!,
      'twitter:image': image, 'twitter:image:alt': imageAlt,
    })) {
      const tag = head.locator(`meta[property="${key}"], meta[name="${key}"]`);
      await expect(tag).toHaveCount(1);
      await expect(tag).toHaveAttribute('content', value);
    }
  });
}

test('the web manifest identifies BookMe and links to the home-screen icons', async ({ request }) => {
  const response = await request.get('/site.webmanifest');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^application\/manifest\+json/);
  expect(await response.json()).toMatchObject({
    name: 'BookMe', short_name: 'BookMe', start_url: '/', scope: '/', display: 'browser',
    theme_color: '#181a1d', background_color: '#181a1d',
    icons: [
      { src: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  });
});

test('favicon, home-screen and social images are served in their advertised formats and sizes', async ({ request }) => {
  const ico = await request.get('/favicon.ico');
  expect(ico.status()).toBe(200);
  expect(ico.headers()['content-type']).toMatch(/^image\/(?:x-icon|vnd.microsoft.icon)/);
  const bytes = await ico.body();
  expect(bytes.readUInt16LE(0)).toBe(0);
  expect(bytes.readUInt16LE(2)).toBe(1);
  expect(bytes.readUInt16LE(4)).toBe(3);
  for (const [index, size] of [16, 32, 48].entries()) {
    const entry = 6 + index * 16;
    expect(bytes[entry]).toBe(size);
    expect(bytes[entry + 1]).toBe(size);
    const length = bytes.readUInt32LE(entry + 8);
    const offset = bytes.readUInt32LE(entry + 12);
    const frame = bytes.subarray(offset, offset + length);
    expect(frame.length).toBe(length);
    expect(frame.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(frame.readUInt32BE(16)).toBe(size);
    expect(frame.readUInt32BE(20)).toBe(size);
  }

  for (const [path, width, height] of [
    ['/favicon-96x96.png', 96, 96],
    ['/apple-touch-icon.png', 180, 180],
    ['/web-app-manifest-192x192.png', 192, 192],
    ['/web-app-manifest-512x512.png', 512, 512],
    ['/social/bookme-ro.png', 1200, 630],
    ['/social/bookme-en.png', 1200, 630],
  ] as const) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()['content-type']).toMatch(/^image\/png/);
    expect(response.headers()['x-robots-tag'] ?? '').not.toMatch(/noindex|none/i);
    const png = await response.body();
    expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(png.readUInt32BE(16)).toBe(width);
    expect(png.readUInt32BE(20)).toBe(height);
  }
});
