import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = new URL('../', import.meta.url);
const source = new URL('design/branding/', root);
const output = new URL('public/', root);
const dataUrl = async (path, type) => `data:${type};base64,${(await readFile(new URL(path, root))).toString('base64')}`;
const master = await dataUrl('design/branding/bookme-mark-master.png', 'image/png');
const browser = await chromium.launch();

try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const frames = new Map();
  // Progressive downsampling keeps the pin contour and B counters open at tab sizes.
  for (const size of [16, 32, 48, 96, 180, 192, 512]) {
    const png = await page.evaluate(async ({ master, size }) => {
      const image = new Image();
      image.src = master;
      await image.decode();
      let input = image;
      let width = image.naturalWidth;
      do {
        width = Math.max(size, Math.floor(width / 2));
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = width;
        const context = canvas.getContext('2d');
        context.imageSmoothingQuality = 'high';
        context.fillStyle = '#181a1d';
        context.fillRect(0, 0, width, width);
        context.drawImage(input, 0, 0, width, width);
        input = canvas;
      } while (width > size);
      return input.toDataURL('image/png').split(',')[1];
    }, { master, size });
    frames.set(size, Buffer.from(png, 'base64'));
  }

  // ICO directory followed by three lossless PNG frames (16/32/48 px).
  const sizes = [16, 32, 48];
  const directory = Buffer.alloc(6 + sizes.length * 16);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(sizes.length, 4);
  let offset = directory.length;
  sizes.forEach((size, index) => {
    const entry = 6 + index * 16;
    directory[entry] = directory[entry + 1] = size;
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(frames.get(size).length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += frames.get(size).length;
  });
  await writeFile(new URL('favicon.ico', output), Buffer.concat([directory, ...sizes.map((size) => frames.get(size))]));
  for (const [name, size] of [
    ['favicon-96x96.png', 96], ['apple-touch-icon.png', 180],
    ['web-app-manifest-192x192.png', 192], ['web-app-manifest-512x512.png', 512],
  ]) await writeFile(new URL(name, output), frames.get(size));

  const sans = await dataUrl('node_modules/@fontsource/dm-sans/files/dm-sans-latin-ext-500-normal.woff2', 'font/woff2');
  const serif = await dataUrl('node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-ext-400-normal.woff2', 'font/woff2');
  const sansLatin = await dataUrl('node_modules/@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff2', 'font/woff2');
  const serifLatin = await dataUrl('node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2', 'font/woff2');
  await mkdir(new URL('social/', output), { recursive: true });
  for (const [locale, audience, headline] of [
    ['ro', 'CLIENȚI · SALOANE · SPECIALIȘTI', 'Programări la salon,<br>în ritmul tău.'],
    ['en', 'CLIENTS · SALONS · PROFESSIONALS', 'Beauty appointments,<br>at your pace.'],
  ]) {
    await page.setContent(`<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><style>
      @font-face { font-family: Sans; src: url('${sansLatin}'); }
      @font-face { font-family: Sans; src: url('${sans}'); unicode-range: U+0100-02FF; }
      @font-face { font-family: Serif; src: url('${serifLatin}'); }
      @font-face { font-family: Serif; src: url('${serif}'); unicode-range: U+0100-02FF; }
      * { box-sizing: border-box; } body { margin: 0; width: 1200px; height: 630px; padding: 62px 72px;
        background: #181a1d; color: #f5f2eb; border-top: 8px solid #dfbf7a; font-family: Sans; }
      .brand { font-size: 48px; letter-spacing: -2px; } .brand span { color: #dfbf7a; }
      .audience { margin: 60px 0 22px; color: #dfbf7a; font-size: 18px; letter-spacing: 2px; }
      h1 { margin: 0; font: 76px/1.08 Serif; letter-spacing: -1px; }
      img { position: absolute; width: 320px; height: 320px; top: 175px; right: 44px; }
      footer { position: absolute; bottom: 55px; left: 72px; right: 72px; display: flex;
        justify-content: space-between; border-top: 1px solid #474b53; padding-top: 24px;
        font-size: 22px; } .location { color: #b9b9c0; font-size: 17px; letter-spacing: 3px; }
    </style></head><body><div class="brand">BookMe<span>.</span></div>
      <p class="audience">${audience}</p><h1>${headline}</h1><img src="${master}" alt="">
      <footer><span class="location">MOLDOVA</span><span>bookme.md</span></footer>
    </body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('img').evaluate((image) => image.decode());
    await page.screenshot({ path: fileURLToPath(new URL(`social/bookme-${locale}.png`, output)) });
  }

  await page.setViewportSize({ width: 760, height: 300 });
  const tabs = sizes.map((size) => `<div><img width="${size}" height="${size}" src="data:image/png;base64,${frames.get(size).toString('base64')}"><span>BookMe — ${size} px</span></div>`).join('');
  await page.setContent(`<style>body { margin: 0; font: 16px system-ui; } section { height: 150px; padding: 0 28px; display: flex; align-items: center; gap: 30px; } .light { background: #f1f3f5; color: #181a1d; } .dark { background: #25282d; color: #f5f2eb; } div { display: flex; align-items: center; gap: 10px; } img { flex-shrink: 0; }</style><section class="light">${tabs}</section><section class="dark">${tabs}</section>`);
  await page.evaluate(() => Promise.all([...document.images].map((image) => image.decode())));
  await page.screenshot({ path: fileURLToPath(new URL('favicon-size-check.png', source)) });

  await page.setViewportSize({ width: 600, height: 630 });
  const ro = await dataUrl('public/social/bookme-ro.png', 'image/png');
  const en = await dataUrl('public/social/bookme-en.png', 'image/png');
  await page.setContent(`<style>body { margin: 0; } img { display: block; width: 600px; height: 315px; }</style><img src="${ro}" alt="Romanian preview"><img src="${en}" alt="English preview">`);
  await page.evaluate(() => Promise.all([...document.images].map((image) => image.decode())));
  await page.screenshot({ path: fileURLToPath(new URL('social-size-check.png', source)) });
} finally {
  await browser.close();
}
