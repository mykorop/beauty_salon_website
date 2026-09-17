# BookMe indexing and production verification

The build contains eight indexable RO/EN pages and one shared, bilingual
`404.html`. All copy, metadata and JSON-LD are present in the static HTML.

## URLs and languages

`src/i18n.ts` owns the `https://bookme.md` origin and the public page map used by
navigation, language switches, canonical URLs, language alternatives and sitemap.
Legal route generation also reads that map. Homepage canonical URLs are `/` and
`/en/`; directly served `/index.html` and `/en/index.html` identify those same
canonical URLs. Every page has reciprocal `ro`, `en` and `x-default` alternatives;
`x-default` points to its Romanian counterpart. Existing legal Markdown links use
canonical paths and are covered by the link crawler.

`/sitemap.xml` contains exactly the eight canonical URLs, each with all three
language alternatives. `/robots.txt` allows all crawling, including assets and
favicon, and names the absolute sitemap URL. The 404 page has `noindex, follow`,
no canonical or language-alternate metadata, and no JSON-LD or sitemap entry.
It offers Romanian and English homepage links without JavaScript.

This follows Google's guidance on [localized page alternatives](https://developers.google.com/search/docs/specialty/international/localized-versions)
and [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## Structured data and evidence

`StructuredData.astro` emits one JSON-LD graph with stable organization and website
IDs and a localized WebPage node. Only the homepages add the two SoftwareApplication
nodes, beside the visible descriptions and store links. JSON is escaped before
embedding it in HTML.

| Properties | Evidence and maintenance |
| --- | --- |
| Organization name, legal name, URL and support email | BookMe; BOOKME HUB, SRL; `https://bookme.md/`; `support@bookme.md`, as stated in the [published terms source](../src/content/legal/en/terms.md) and [operator evidence record](../.scratch/bookme-website-refresh/audit/terms-publication.md). |
| WebSite languages; WebPage URL, language, name and description | Public page map and the same localized title/description used by the HTML head. |
| App names, business alternate name and install URLs | The four existing downloads confirmed in [ticket 03](../.scratch/bookme-website-refresh/issues/03-client-business-homepage.md), now shared in `src/content/apps.ts`. BookMe Business is called BookMe Salon in the App Store. |
| App descriptions | The visible localized download descriptions in `src/content/home.ts`; no separate SEO copy. |
| Android/iOS, lifestyle/business categories | The linked Google Play/App Store distributions and the client booking/business management functions described on the homepage. No OS version requirement is asserted. |
| `isAccessibleForFree: true` | The confirmed free-platform wording in the homepage FAQ and terms; booked salon/professional services are paid separately. |

The graph uses [Schema.org SoftwareApplication](https://schema.org/SoftwareApplication)
and [Organization](https://schema.org/Organization) properties. There are no
invented ratings, reviews, user counts or awards. This is descriptive markup;
we do not claim eligibility for Google's software-app rich results. Their
[separate requirements](https://developers.google.com/search/docs/appearance/structured-data/software-app)
include rating/review and offer information. Do not invent those fields to satisfy
a rich-results validator.

The existing RO/EN copy covers booking salons and independent professionals in
Moldova, along with business calendars, services and teams. It retains one
meaningful H1 per page, a sequential heading hierarchy, descriptive link labels
and localized accessible descriptions for the illustrative app previews.

## Local production checks

```sh
npm run check
npm run test:seo
```

`test:seo` builds before running `tests/seo.spec.ts` against Astro's static preview
server. Tests run in desktop and mobile without JavaScript. They check unique,
nonempty metadata; H1/lang; canonical and reciprocal hreflang; legacy homepage
aliases; accidental meta/header noindex; the exact sitemap/robots contract;
parseable JSON-LD and its supported property values; heading order and image/link
names; internal page/asset status and fragment targets; and a styled HTTP 404 at
unknown root and nested English URLs. Axe runs on the 404 page in the JavaScript
enabled project. Existing branding tests verify localized titles/descriptions and
crawlable favicon/social assets. `npm test` runs these checks with the whole suite
in CI against the build from the preceding `npm run build` step.

The preview server already serves unknown URLs with status 404 and uses
`dist/404.html` as its error document. Direct access to `/404.html` returns 200 in
preview, but still carries noindex. This local behavior does not configure the
future production host. Astro documents the generated error page in its
[custom 404 guide](https://docs.astro.build/en/basics/astro-pages/#custom-404-error-page).

## Future production checks — after a separately authorized deployment

These checks are pending. This ticket does not publish the site, change DNS,
configure hosting or connect external accounts.

1. **Domain and HTTPS:** verify the certificate for `bookme.md`, the intended
   domain's DNS and one-hop permanent redirects from HTTP and any `www` alias to
   `https://bookme.md`, preserving paths and queries. Verify no preview hostname
   appears in canonical, social, sitemap or JSON-LD URLs.
2. **Statuses and error documents:** request all eight canonical URLs directly;
   expect 200 HTML without login requirements. Check both `index.html` aliases
   retain their matching canonical, or permanently redirect to it. Configure the
   host to serve `404.html` with HTTP **404** at unknown paths, including nested
   English paths. Disable homepage/SPA fallback. Check the two return links and
   that error-page assets load.
3. **Indexability:** inspect the actual response HTML and headers for every
   language pair. Verify self-canonical, all reciprocal alternatives, full text,
   and absence of `noindex` in meta tags or `X-Robots-Tag` on the eight pages.
   Keep the error document noindex; ensure no hosting-level robots rule overrides
   the built files. Confirm favicon and page assets return 200 and are crawlable.
4. **Sitemap:** fetch `/robots.txt` and `/sitemap.xml` over HTTPS. Check content
   types, eight canonical entries, valid XML namespaces, language alternatives,
   no `index.html` aliases and no 404 URLs.
5. **Search Console:** an authorized owner should verify the property, submit
   `https://bookme.md/sitemap.xml`, and use URL Inspection on RO/EN homepage and
   legal-page pairs. Compare the declared and Google-selected canonicals, rendered
   content and indexing status; follow up on exclusions or unexpected duplicates
   after crawling. See the [Search Console guide](https://developers.google.com/search/docs/monitor-debug/search-console-start).
6. **Structured data:** validate the live graph syntax and Schema.org properties;
   confirm the app descriptions still match visible content and current store
   destinations. Record rich-results limitations without adding unsupported claims.
7. **PageSpeed Insights:** run mobile and desktop checks on both homepages and a
   representative legal page at [PageSpeed Insights](https://pagespeed.web.dev/).
   Record URLs, date, lab metrics, accessibility/SEO results and field Core Web
   Vitals when available. Investigate regressions; no score or indexing outcome is
   guaranteed by the local tests.
