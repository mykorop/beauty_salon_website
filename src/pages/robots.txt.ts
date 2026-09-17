import type { APIRoute } from 'astro';
import { siteOrigin } from '../i18n';

export const GET: APIRoute = () => new Response(
  `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
