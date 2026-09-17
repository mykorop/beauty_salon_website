import type { APIRoute } from 'astro';
import { absolutePageUrl, languageAlternates, locales, pageNames } from '../i18n';

export const GET: APIRoute = () => {
  const urls = pageNames.flatMap((page) => locales.map((locale) => `
  <url>
    <loc>${absolutePageUrl(locale, page)}</loc>
    ${languageAlternates(page).map(({ language, href }) => `<xhtml:link rel="alternate" hreflang="${language}" href="${href}" />`).join('\n    ')}
  </url>`)).join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}
</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
