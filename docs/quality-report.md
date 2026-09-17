# Ticket 09 acceptance report

The automated checks pass on the current production build, measured on
**18 September 2026 (Europe/Kyiv)**. The local host is macOS 26.6.2 / Apple M4 Max
(arm64), Node 24.20.0 and npm 11.19.0. These are local results; the committed
GitHub Actions workflow has not been run remotely in this task.

Build baseline: `409b21f798f93a08e9c5505349703b386e122548`, plus this ticket's
CSS target-size change. No production source changed after the measured build.
`npm run check` reports 0 errors, 0 warnings, 0 hints; `npm run build` produces
eight indexable pages plus the separate 404 document. Every page stays static;
local Latin/Latin Extended WOFF2 fonts use `font-display: swap`, illustrations
are HTML/CSS with no image downloads, and the only executable page script is the
small contact enhancement. There are no remote fonts, app framework hydration,
entrance-animation content hiding, or raster images needing LCP priority/dimensions.

Pinned browser tooling: Playwright 1.63.0; Chromium 153.0.8010.12 (revision 1243),
Firefox 155.0 (1543), WebKit 26.6 (2359); axe 4.13.0; Lighthouse CI 0.15.1 with
Lighthouse 12.6.1. Exact settings and host/browser user agents are in the raw reports.

## Lighthouse results

**48 of 48 runs passed** (eight pages × two profiles × three runs). Performance,
LCP, CLS and TBT below are independent medians. Accessibility / Best Practices /
SEO are **100 / 100 / 100 in every individual run**, not just their medians.
All audits remained enabled. Mobile uses the standard simulated profile (412×823,
150 ms RTT, 1,638.4 Kbps, 4× CPU); desktop uses the pinned desktop preset.

| Profile | Page | Performance | LCP (ms) | CLS | TBT (ms) |
| --- | --- | ---: | ---: | ---: | ---: |
| mobile | `/` | 99 | 1653.8 | 0.00957 | 0 |
| mobile | `/privacy.html` | 99 | 1502.2 | 0.04876 | 0 |
| mobile | `/terms.html` | 100 | 1502.2 | 0.00264 | 0 |
| mobile | `/delete-account.html` | 99 | 1502.0 | 0.04772 | 0 |
| mobile | `/en/` | 97 | 1653.6 | 0.08759 | 0 |
| mobile | `/en/privacy.html` | 100 | 1502.4 | 0.00123 | 0 |
| mobile | `/en/terms.html` | 100 | 1502.1 | 0.00092 | 0 |
| mobile | `/en/delete-account.html` | 100 | 1502.3 | 0.00595 | 0 |
| desktop | `/` | 100 | 403.9 | 0.01126 | 0 |
| desktop | `/privacy.html` | 100 | 361.9 | 0.00157 | 0 |
| desktop | `/terms.html` | 100 | 362.0 | 0.00103 | 0 |
| desktop | `/delete-account.html` | 100 | 362.1 | 0.00661 | 0 |
| desktop | `/en/` | 100 | 403.5 | 0.00148 | 0 |
| desktop | `/en/privacy.html` | 100 | 362.3 | 0.00639 | 0 |
| desktop | `/en/terms.html` | 100 | 361.8 | 0.00081 | 0 |
| desktop | `/en/delete-account.html` | 100 | 361.8 | 0.00446 | 0 |

Raw JSON/HTML and assertions: `reports/lighthouse/{mobile,desktop}/raw/`.
Machine-readable aggregates: `reports/lighthouse/summary.json`. Both profile
assertion commands exited successfully. The initial mobile and desktop homepage
screenshots were visually inspected; this limited check is not a manual WCAG audit.

## Per-page asset budgets

Gzip level 9, decimal bytes, with the [documented accounting method](quality-gates.md#transfer-budgets).
Limits: JavaScript ≤20,000, CSS ≤40,000. Reports: `reports/budgets/`.

| Page | JavaScript (bytes) | CSS (bytes) |
| --- | ---: | ---: |
| `/delete-account.html` | 0 | 2145 |
| `/en/` | 534 | 4405 |
| `/en/delete-account.html` | 0 | 2145 |
| `/en/privacy.html` | 0 | 2145 |
| `/en/terms.html` | 0 | 2145 |
| `/privacy.html` | 0 | 2145 |
| `/terms.html` | 0 | 2145 |
| `/` | 534 | 4405 |

The new 44px target test first failed on language, privacy and support links,
then passed after enlarging link targets. Separate deliberate oversized inline
JavaScript and CSS probes each failed at their correct budget assertion; the
original production HTML was restored automatically before the final suite.
Probe logs and results are in `reports/budget-probe-*.log` and
`reports/budget-probes.json`.

## Browser and axe results

The full final `npm test` run completed in **102.1 seconds**: **734 passed,
76 intentionally skipped, 0 failed, 0 flaky** (810 test instances). The final
run used no retries. All enabled axe scans found zero violations, including
320px mocked form states in Chromium, Firefox and WebKit.

| Project | Passed | Intentional skips | Failed |
| --- | ---: | ---: | ---: |
| chromium | 135 | 0 | 0 |
| firefox | 127 | 8 | 0 |
| webkit | 127 | 8 | 0 |
| chromium-mobile-no-js | 115 | 20 | 0 |
| firefox-mobile-no-js | 115 | 20 | 0 |
| webkit-mobile-no-js | 115 | 20 | 0 |

The skips are 40 duplicate budget measurements outside Chromium and 36
JavaScript-dependent checks in the three no-JavaScript projects (axe-only
homepage tests and fetch-based contact states). No browser engine or required
page is skipped; native content, links, forms, FAQ, reflow, keyboard and reduced
motion checks still run without page JavaScript.

macOS WebKit uses native Option-Tab for link traversal. Focus obstruction checks
use the visible viewport intersection without forcing scrolling. Font loading
is polled through `document.fonts.status`: this preserves the font and layout
assertions while avoiding a reproduced Firefox no-JavaScript `fonts.ready`
automation-promise stall. These changes affect only test synchronization and
keyboard input, not the production pages or Lighthouse results.

Final machine-readable results: `reports/playwright.json`; interactive report:
`playwright-report/index.html`; command output: `reports/full-suite.log`.
CI retains these alongside traces/screenshots on failure and Lighthouse/budget
reports for 14 days. The workflow runs the same type/build/browser/Lighthouse
commands sequentially and uploads the static archive only after the gates pass.

## Static artifact

[Download the local static archive](../artifacts/bookme-website.tar.gz).
The archive contains the contents of `dist/` at its root, with nine HTML
files (eight indexable plus 404), local assets, robots and sitemap. It contains
no browser tests, Node runtime or oversized budget probes.

SHA-256:

```text
d84022b6d5414163b0cae6ef9a59805560a24aac6c4ad66fafcd7f377fab23da
```

See the [deployment instructions](deployment.md) for HTTPS, caching, status codes
and public PageSpeed checks. No deployment was performed.

## Remaining acceptance items

The ticket must stay open until the following evidence exists:

- **Content approval:** ticket 05 remains `needs-info` for confirmed legal bases
  mapped to processing purposes. These checks cover the current complete eight-page
  build; repeat the final gates after that approved text changes.
- **Manual WCAG review:** keyboard/focus walkthrough, VoiceOver/Safari announcements
  and pronunciation, actual 400% browser zoom, visual contrast review and OS reduced
  motion review have not been completed by a human in this run. Automated keyboard,
  focus obstruction, 320px reflow, axe and emulated reduced motion are separate
  evidence, not substitutes. Record tester/date/OS/browser/build/results using the
  [manual procedure](quality-gates.md#manual-acceptance-record).
- **Hosted checks:** production HTTPS, cache/compression headers, HTTP statuses,
  public PageSpeed, and future field CWV await a separately approved deployment.
  The [artifact handoff](deployment.md) describes the operator checks. No publication,
  DNS/CDN changes or Search Console connection has been performed.

Field targets are p75 LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1. Laboratory TBT is not
field INP, and this report makes no field performance claim.

## Review

Standards: an independent review found no documented-standard violations or
substantive code-smell findings. Spec: an independent review found no actionable
implementation discrepancies or scope creep after fixes. The manual and content
approval items above remain open. Both reviews used the staged
implementation relative to `409b21f`; final follow-up reviews checked the results
and acceptance record. One packaging finding (macOS AppleDouble metadata) was
fixed with `COPYFILE_DISABLE=1`; the regenerated archive matches every production
file byte-for-byte and contains no extra metadata.

## Tooling dependency audit

`npm audit --omit=dev` found zero vulnerabilities. The current published Lighthouse
CI 0.15.1 dependency tree adds 10 development-tool advisories (7 high, 1 moderate,
2 low). They concern its upstream dependencies; no forced major-version overrides
or audit suppression were introduced. These dependencies do not ship in the static
artifact. The committed lockfile records the exact tree for a future tooling update.
