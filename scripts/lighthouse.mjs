import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const rows = [];
let failed = false;
for (const profile of ['mobile', 'desktop']) {
  const directory = `reports/lighthouse/${profile}`;
  rmSync(directory, { recursive: true, force: true });
  rmSync('.lighthouseci', { recursive: true, force: true });
  const result = spawnSync(process.execPath, ['node_modules/@lhci/cli/src/cli.js', 'autorun', '--config=lighthouserc.cjs'], {
    stdio: 'inherit', env: { ...process.env, LIGHTHOUSE_PROFILE: profile },
  });
  failed ||= result.status !== 0;
  mkdirSync(directory, { recursive: true });
  // Keep every raw run and assertion, including on a failed gate.
  if (!existsSync('.lighthouseci')) {
    failed = true;
    console.error(`${profile}: Lighthouse did not produce reports.`);
    continue;
  }
  cpSync('.lighthouseci', `${directory}/raw`, { recursive: true });
  const reports = readdirSync('.lighthouseci').filter((name) => /^lhr-.*\.json$/.test(name)).map((name) => JSON.parse(readFileSync(`.lighthouseci/${name}`, 'utf8')));
  const urls = [...new Set(reports.map((report) => report.requestedUrl))];
  if (urls.length !== 8 || reports.length !== 24) failed = true;
  for (const url of urls) {
    const runs = reports.filter((report) => report.requestedUrl === url);
    if (runs.length !== 3) failed = true;
    if (runs.some((run) => run.runtimeError || !run.categories || Object.values(run.categories).some((category) => category.score === null))) {
      failed = true;
      console.error(`${profile} ${url}: invalid Lighthouse run; inspect raw reports.`);
      continue;
    }
    const median = (values) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
    rows.push({
      profile, path: new URL(url).pathname, runs: runs.length,
      performance: median(runs.map((run) => run.categories.performance.score * 100)),
      accessibility: Math.min(...runs.map((run) => run.categories.accessibility.score * 100)),
      bestPractices: Math.min(...runs.map((run) => run.categories['best-practices'].score * 100)),
      seo: Math.min(...runs.map((run) => run.categories.seo.score * 100)),
      lcp: median(runs.map((run) => run.audits['largest-contentful-paint'].numericValue)),
      cls: median(runs.map((run) => run.audits['cumulative-layout-shift'].numericValue)),
      tbt: median(runs.map((run) => run.audits['total-blocking-time'].numericValue)),
    });
  }
}
writeFileSync('reports/lighthouse/summary.json', JSON.stringify(rows, null, 2));
console.table(rows);
process.exitCode = failed ? 1 : 0;
