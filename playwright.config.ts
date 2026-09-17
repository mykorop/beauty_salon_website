import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4329',
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile-no-js',
      use: { ...devices['Pixel 7'], javaScriptEnabled: false },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4329 --ignore-lock',
    url: 'http://127.0.0.1:4329',
    reuseExistingServer: false,
  },
});
