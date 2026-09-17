import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { siteOrigin } from './src/i18n.ts';

export default defineConfig({
  site: siteOrigin,
  output: 'static',
  build: { format: 'preserve' },
  markdown: { processor: satteri({ features: { smartPunctuation: false } }) },
});
