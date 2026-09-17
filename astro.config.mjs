import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  output: 'static',
  build: { format: 'preserve' },
  markdown: { processor: satteri({ features: { smartPunctuation: false } }) },
});
