import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { siteOrigin } from './src/i18n.ts';
import { fileURLToPath } from 'node:url';

const consentTest = ['1', 'incomplete'].includes(process.env.BOOKME_CONSENT_TEST);
const providerPath = process.env.BOOKME_CONSENT_TEST === 'incomplete' ? './tests/support/incomplete-provider.ts'
  : consentTest ? './tests/support/analytics-provider.ts' : './src/consent/provider.ts';

export default defineConfig({
  site: siteOrigin,
  output: 'static',
  outDir: consentTest ? './dist-consent-test' : './dist',
  vite: { resolve: { alias: {
    '#analytics-provider': fileURLToPath(new URL(providerPath, import.meta.url)),
  } } },
  build: { format: 'preserve' },
  markdown: { processor: satteri({ features: { smartPunctuation: false } }) },
});
