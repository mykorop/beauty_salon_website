const { chromium } = require('@playwright/test');

const profile = process.env.LIGHTHOUSE_PROFILE || 'mobile';
if (!['mobile', 'desktop'].includes(profile)) throw new Error(`Unknown Lighthouse profile: ${profile}`);

module.exports = {
  ci: {
    collect: {
      url: ['/', '/privacy.html', '/terms.html', '/delete-account.html', '/en/', '/en/privacy.html', '/en/terms.html', '/en/delete-account.html'].map((path) => `http://127.0.0.1:4330${path}`),
      numberOfRuns: 3,
      chromePath: chromium.executablePath(),
      startServerCommand: 'npm run preview -- --host 127.0.0.1 --port 4330 --ignore-lock',
      startServerReadyPattern: '127.0.0.1:4330',
      settings: {
        ...(profile === 'desktop' ? { preset: 'desktop' } : {}),
        chromeFlags: '--headless --no-sandbox --disable-dev-shm-usage',
        blockedUrlPatterns: ['https://formbold.com/*'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
        'categories:accessibility': ['error', { minScore: 1, aggregationMethod: 'pessimistic' }],
        'categories:best-practices': ['error', { minScore: 1, aggregationMethod: 'pessimistic' }],
        'categories:seo': ['error', { minScore: 1, aggregationMethod: 'pessimistic' }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500, aggregationMethod: 'median' }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1, aggregationMethod: 'median' }],
        'total-blocking-time': ['error', { maxNumericValue: 200, aggregationMethod: 'median' }],
      },
    },
    upload: { target: 'filesystem', outputDir: `reports/lighthouse/${profile}` },
  },
};
