# Production quality gates

Run with Node 24.20.0 and npm 11.19.0 from the repository root:

```sh
npm ci
npx playwright install --with-deps chromium firefox webkit
npm run check
npm run build
npm test
npm run test:lighthouse
npm run package:site
```

Both browser tools use the completed `dist/` build. Rebuild after any source
change. Ports 4329 (Playwright) and 4330 (Lighthouse) must be free. Run the two
suites sequentially, without competing builds or browser jobs during Lighthouse.
The eight indexable RO/EN pages are required; legacy homepage aliases and the
404 document receive additional functional checks. The browser tests never use
production accounts or real personal data, and a shared fixture blocks all
non-local browser requests. Contact tests override that boundary with synthetic replies,
including the native no-JavaScript POST. Lighthouse blocks the FormBold endpoint.

## Browser and accessibility checks

Playwright 1.63.0 pins the downloaded Chromium, Firefox and WebKit revisions.
All three run the functional suite on desktop and at a mobile viewport with
JavaScript disabled. Responsive tests also exercise 320px with JavaScript in
each engine. Existing tests cover the always-visible mobile navigation (there
is no collapsed menu state), both languages, old URLs, legal links, FAQ,
mocked contact states, 404, complete HTML, and no-JavaScript navigation/forms.
Axe 4.13.0 scans all pages at 320/768/1440px and the expanded FAQ and idle,
invalid, pending, success and failure form states. Contact tests use a 320px
viewport in every engine. JavaScript-dependent checks
are explicitly skipped in no-JavaScript projects; behavior tests still run.
Additional checks cover 44×44 CSS px targets, keyboard focus outlines and
obstruction at 320px, reflow, and reduced motion.

On macOS, WebKit tests use Option-Tab to include links under the default keyboard
navigation preference; other engines and Linux CI use Tab. This is a native
keyboard path, not programmatic focus or a changed OS setting (see the
[upstream WebKit keyboard-setting report](https://github.com/microsoft/playwright/issues/41808)).
The obstruction check samples the visible part of the focused control: Firefox
may leave a wrapped link partly beyond the viewport edge. Tests do not scroll
the target on the user's behalf or suppress a failed focus assertion.

`reports/playwright.json` and `playwright-report/` contain the results;
`test-results/` includes failure screenshots, traces and test attachments.
Open the report with `npx playwright show-report`. To run a focused check:

```sh
npm test -- tests/quality.spec.ts --project=firefox
npm run test:budgets
```

## Transfer budgets

`tests/budgets.spec.ts` measures each page on a fresh Chromium navigation of the
production build, through the load event and network idle. It sums gzip level 9
byte lengths of each unique loaded script/stylesheet response and each inline
executable script/style block, event handler and style attribute. This includes
module dependencies and CSS imports requested by the browser. Embedded JSON-LD
is metadata, not executable JavaScript. Fonts, HTML and images are excluded from
these two budgets, but remain part of Lighthouse's page load measurement.
Inline blocks are compressed separately, conservatively including gzip overhead;
this is a reproducible normalized budget, not the preview server's wire encoding.

Limits are decimal **20,000 bytes JavaScript and 40,000 bytes CSS per page**,
including shared resources on every page that loads them. There is no CDN or
third-party script exemption. The current site has no interaction-loaded assets;
if deferred imports are added, extend this test to exercise their public trigger
before measuring. Per-resource byte counts and totals are attached to the browser
report and written to `reports/budgets/`.

## Lighthouse CI

`@lhci/cli` 0.15.1 pins Lighthouse 12.6.1; npm's committed lockfile fixes all
transitive versions. The Chrome executable is the Chromium revision bundled
with Playwright, not a system Chrome that updates independently. CI uses
`ubuntu-24.04`; local machine/OS differences can still affect timing.

`lighthouserc.cjs` uses Lighthouse's pinned standard simulated mobile profile and
desktop preset. `scripts/lighthouse.mjs` runs both sequentially, three cold runs
for each of the eight URLs: **48 reports**. Every audit remains enabled.
Assertions follow [Lighthouse CI's aggregation rules](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#aggregation-methods):

| Measure | Aggregation | Gate |
| --- | --- | --- |
| Performance | Median of each URL/profile's 3 scores | ≥95 |
| Accessibility, Best Practices, SEO | Worst score, so every run must pass | 100 each |
| LCP | Median | ≤2,500 ms |
| CLS | Median | ≤0.1 |
| TBT | Median | ≤200 ms |

The wrapper also fails if the expected run counts are missing. HTML/JSON reports,
all raw runs, settings, browser/tool versions, and assertion results are saved in
`reports/lighthouse/{mobile,desktop}/`, with a combined `summary.json`. Reports
stay on disk and in repository workflow artifacts; there is no Lighthouse upload
server or temporary public report storage. CI keeps reports even on failure.

## Manual acceptance record

Automation does not certify WCAG conformance. Record tester, date, OS/browser,
build commit and result for each item below in the final report. Use both languages
and all eight pages; any remaining item must remain explicitly pending.

- Keyboard only: skip link, every navigation/language/legal link, all FAQ
  disclosures and form states; logical order, visible and unobscured focus.
- VoiceOver on macOS: landmarks/headings, language pronunciation, link names,
  field labels and descriptions; validation, sending, success and failure announced
  once with sensible focus. Use intercepted test replies, never the live inbox.
- Browser zoom at 400% from a 1280px desktop window: content and controls remain
  readable and usable, without two-dimensional scrolling or clipping. A 320 CSS
  px automated viewport is a reflow check, not evidence of manual browser zoom.
- Inspect contrast, including focus indicators, borders, disabled/pending states
  and decorative backgrounds; axe covers only automatically detectable cases.
- Enable OS reduced motion and inspect navigation, hover and content visibility.

Use Safari with `npm run preview` for static navigation and zoom. For form-state
announcements, use the intercepted headed WebKit tests and pause/step in the
Playwright Inspector so VoiceOver can inspect each state:

```sh
npm test -- tests/contact.spec.ts --project=webkit --headed --debug
```

Record the exact browser used for each manual result. Do not submit the native
form from an ordinary preview/Safari session: that would reach the real inbox.

Field Core Web Vitals need real traffic after a separately approved deployment:
at the **75th percentile**, LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1. A passing lab
TBT result is **not a measurement of field INP**. Public PageSpeed/CrUX may have
no field data until traffic is sufficient. See [deployment checks](deployment.md).
