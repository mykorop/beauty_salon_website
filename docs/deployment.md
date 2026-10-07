# Static artifact handoff

The deliverable is `artifacts/bookme-website.tar.gz` (also the `bookme-static-site`
CI artifact). Its root contains the contents of `dist/`: ten indexable pages,
`404.html`, local fonts/styles/scripts, branding, sitemap and robots.txt. Extract
to an empty staging directory with `tar -xzf bookme-website.tar.gz -C <directory>`.
Deploy those contents at the root of `https://bookme.md`, preserving filenames.
No application server or production Node runtime is required.

This task only builds and hands off the artifact. Deployment, DNS/CDN changes
and Search Console registration are separate operator actions. Ticket 05's
content approval and the manual accessibility record must be completed before
declaring the whole website approved for release.

Before publishing the cookie notice, complete the [consent hosting and manual
acceptance checks](cookie-consent.md#hosting-boundary-and-publication-condition).
Local build checks cannot verify host-injected analytics. Publish only `dist/`;
`dist-consent-test/` contains browser-test fixtures and is never a release artifact.

## Hosting settings to verify

- HTTPS: valid certificate for the public host, no mixed content, HTTP redirected
  to HTTPS; the chosen canonical hostname must match `src/i18n.ts`.
- Routing: directory `index.html`, direct `.html` URLs, `/ru/` and `/en/` must work. Unknown
  paths must return the custom `404.html` **with status 404**, not a 200 SPA fallback.
- Compression: enable gzip/Brotli for HTML, CSS, JavaScript, SVG, JSON and XML;
  vary responses by `Accept-Encoding`. Budget gzip is normalized; verify actual
  host transfer behavior independently.
- Caching: fingerprinted `/_astro/` assets may use
  `Cache-Control: public, max-age=31536000, immutable`. HTML, `robots.txt`, sitemap,
  manifest and unversioned public icons/social images must revalidate or use a
  short TTL; never mark unversioned pages/images immutable. Deploy atomically and
  retain previously referenced fingerprinted assets through cache expiration.
- MIME types: HTML as `text/html`, CSS as `text/css`, scripts as JavaScript,
  fonts as `font/woff2`, sitemap as XML, and robots as plain text.

## Operator smoke check after deployment

```sh
curl -I http://bookme.md/
curl -I https://bookme.md/
curl -I https://bookme.md/index.html
curl -I https://bookme.md/ru/
curl -I https://bookme.md/ru/index.html
curl -I https://bookme.md/en/
curl -I https://bookme.md/en/index.html
curl -I https://bookme.md/privacy.html
curl -I https://bookme.md/terms.html
curl -I https://bookme.md/delete-account.html
curl -I https://bookme.md/en/privacy.html
curl -I https://bookme.md/en/terms.html
curl -I https://bookme.md/en/delete-account.html
curl -I https://bookme.md/not-a-real-page
curl -I https://bookme.md/robots.txt
curl -I https://bookme.md/sitemap.xml
curl -I -H 'Accept-Encoding: gzip, br' https://bookme.md/
```

Verify 200 for all real pages/assets, 404 for the missing path, the intended
redirect only on HTTP/alternate hostnames, and correct compression/cache headers.
Select an actual `/_astro/` URL from built HTML and check its long-lived cache
header too. Open all three languages in a browser, inspect the network/console and
confirm navigation, fonts and assets load under HTTPS. Inspect the native form
action without submitting a real support message.

Run [PageSpeed Insights](https://pagespeed.web.dev/) for each of the ten public
URLs in mobile and desktop after release, recording the tested URL, date and
reports. Those measurements validate the host/network; localhost Lighthouse
results cannot establish production HTTPS, caching or field CWV. See the
[quality gates](quality-gates.md) for lab thresholds and the separate field
LCP/INP/CLS targets. See [SEO checks](seo.md) for canonical/sitemap validation.
