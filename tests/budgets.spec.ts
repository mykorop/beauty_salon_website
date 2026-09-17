import { gzipSync } from 'node:zlib';
import { mkdir, writeFile } from 'node:fs/promises';
import { expect, test } from './fixtures';

const paths = ['/', '/privacy.html', '/terms.html', '/delete-account.html', '/en/', '/en/privacy.html', '/en/terms.html', '/en/delete-account.html'];

for (const path of paths) {
  test(`production asset budget for ${path}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Identical production assets are measured once in Chromium.');
    const resources = new Map<string, Promise<{ kind: string; bytes: number }>>();
    const failedRequests: string[] = [];
    page.on('requestfailed', (request) => failedRequests.push(request.url()));
    page.on('response', (response) => {
      const kind = response.request().resourceType();
      if (kind === 'script' || kind === 'stylesheet') {
        resources.set(response.url(), response.body().then((body) => ({ kind, bytes: gzipSync(body, { level: 9 }).length })));
      }
    });
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const inline = await page.evaluate(() => ({
      scripts: [...document.querySelectorAll('script:not([src])')]
        .filter((script) => !script.getAttribute('type') || /^(module|text\/javascript|application\/javascript)$/.test(script.getAttribute('type')!))
        .map((script) => script.textContent ?? ''),
      styles: [...document.querySelectorAll('style')].map((style) => style.textContent ?? ''),
      handlers: [...document.querySelectorAll('*')].flatMap((element) => [...element.attributes].filter(({ name }) => name.startsWith('on')).map(({ value }) => value)),
      styleAttributes: [...document.querySelectorAll('[style]')].map((element) => element.getAttribute('style') ?? ''),
    }));
    const assets = await Promise.all([...resources].map(async ([url, result]) => ({ url, ...await result })));
    const size = (parts: string[]) => parts.filter(Boolean).reduce((total, part) => total + gzipSync(part, { level: 9 }).length, 0);
    const javascript = size([...inline.scripts, ...inline.handlers]) + assets.filter(({ kind }) => kind === 'script').reduce((total, asset) => total + asset.bytes, 0);
    const css = size([...inline.styles, ...inline.styleAttributes]) + assets.filter(({ kind }) => kind === 'stylesheet').reduce((total, asset) => total + asset.bytes, 0);
    const report = { path, gzipLevel: 9, javascript, css, limits: { javascript: 20_000, css: 40_000 }, assets };
    await mkdir('reports/budgets', { recursive: true });
    await writeFile(`reports/budgets/${path === '/' ? 'home' : path.replaceAll('/', '_')}.json`, JSON.stringify(report, null, 2));
    await testInfo.attach('asset-budget', { body: JSON.stringify(report, null, 2), contentType: 'application/json' });
    expect(failedRequests, 'Blocked or failed resources must not silently escape the budget').toEqual([]);
    expect(javascript).toBeLessThanOrEqual(20_000);
    expect(css).toBeLessThanOrEqual(40_000);
  });
}
