import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'reports/playwright.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:4329',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    serviceWorkers: 'block',
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ...(['chromium', 'firefox', 'webkit'] as const).map((browserName) => ({
      name: `${browserName}-mobile-no-js`,
      use: { browserName, viewport: { width: 393, height: 851 }, javaScriptEnabled: false },
    })),
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4329 --ignore-lock',
    url: 'http://127.0.0.1:4329',
    reuseExistingServer: false,
  },
});
