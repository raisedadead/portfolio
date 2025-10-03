#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';

function groupByUrl(comparisons) {
  const grouped = new Map();

  comparisons.forEach((comparison) => {
    if (!grouped.has(comparison.url)) {
      grouped.set(comparison.url, {});
    }
    grouped.get(comparison.url)[comparison.category] = comparison;
  });

  return grouped;
}

function formatScoreCell(comparison) {
  const { indicator, current, delta } = comparison;

  if (delta === null || delta === 0) {
    return `${indicator} ${current}`;
  }

  const sign = delta > 0 ? '+' : '';
  return `${indicator} ${current} (${sign}${delta})`;
}

function calculateSummary(comparisons) {
  const urlsMap = new Map();

  comparisons.forEach((comparison) => {
    if (!urlsMap.has(comparison.url)) {
      urlsMap.set(comparison.url, { passing: true, scores: [] });
    }

    const urlData = urlsMap.get(comparison.url);
    urlData.scores.push(comparison.current);

    if (comparison.status === 'fail') {
      urlData.passing = false;
    }
  });

  const totalUrls = urlsMap.size;
  const passingUrls = Array.from(urlsMap.values()).filter((data) => data.passing).length;

  const allScores = comparisons.map((c) => c.current);
  const avgScore = Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length);

  return { passingUrls, totalUrls, avgScore };
}

function formatReport(comparisons) {
  const grouped = groupByUrl(comparisons);
  const { passingUrls, totalUrls, avgScore } = calculateSummary(comparisons);
  const hasBaseline = comparisons.some((c) => c.baseline !== null);

  // Detect threshold failures and regressions
  const failures = comparisons.filter((c) => c.status === 'fail');
  const regressions = comparisons.filter((c) => c.delta !== null && c.delta < 0);

  const rows = [];
  grouped.forEach((categories, url) => {
    const perf = formatScoreCell(categories.performance);
    const a11y = formatScoreCell(categories.accessibility);
    const bp = formatScoreCell(categories['best-practices']);
    const seo = formatScoreCell(categories.seo);

    rows.push(`| ${url} | ${perf} | ${a11y} | ${bp} | ${seo} |`);
  });

  let report = '**Lighthouse Audit Results**\n\n';
  report += `**Summary**: ${passingUrls}/${totalUrls} pages passing (avg: ${avgScore})\n\n`;
  report += '| URL | Perf | A11y | Best Practices | SEO |\n';
  report += '|-----|------|------|----------------|-----|\n';
  report += `${rows.join('\n')}\n\n`;

  // Show warnings for threshold failures
  if (failures.length > 0) {
    const failuresByUrl = new Map();
    failures.forEach((f) => {
      if (!failuresByUrl.has(f.url)) {
        failuresByUrl.set(f.url, []);
      }
      failuresByUrl.get(f.url).push(f);
    });

    const thresholds = {
      performance: 85,
      accessibility: 90,
      'best-practices': 85,
      seo: 90
    };

    report += '> [!WARNING]\n';
    report += `> **${failures.length} metric${failures.length > 1 ? 's' : ''} below threshold:**\n`;
    failuresByUrl.forEach((metrics, url) => {
      metrics.forEach((m) => {
        const categoryName =
          m.category === 'best-practices' ? 'Best Practices' : m.category.charAt(0).toUpperCase() + m.category.slice(1);
        report += `> - \`${url}\` ${categoryName}: ${m.current}% (threshold: ${thresholds[m.category]}%)\n`;
      });
    });
    report += '\n';
  }

  // Show caution for regressions (only if baseline exists)
  if (hasBaseline && regressions.length > 0) {
    const regressionsByUrl = new Map();
    regressions.forEach((r) => {
      if (!regressionsByUrl.has(r.url)) {
        regressionsByUrl.set(r.url, []);
      }
      regressionsByUrl.get(r.url).push(r);
    });

    report += '> [!CAUTION]\n';
    report += `> **${regressions.length} metric${regressions.length > 1 ? 's' : ''} regressed from baseline:**\n`;
    regressionsByUrl.forEach((metrics, url) => {
      metrics.forEach((m) => {
        const categoryName =
          m.category === 'best-practices' ? 'Best Practices' : m.category.charAt(0).toUpperCase() + m.category.slice(1);
        report += `> - \`${url}\` ${categoryName}: ${m.current}% (${m.delta} from baseline)\n`;
      });
    });
    report += '\n';
  }

  // Add note about baseline establishment only if no baseline AND no warnings shown
  if (!hasBaseline && failures.length === 0) {
    report += '*Baseline will be established after merge to main*\n\n';
  }

  report += '<details>\n';
  report += '<summary>Legend</summary>\n\n';
  report += '**Thresholds**: Perf ≥85%, A11y ≥90%, Best Practices ≥85%, SEO ≥90%\n';
  report += '**Indicators**: 🟢 Good (≥90%) • 🟡 Needs Improvement • 🔴 Below Threshold\n\n';
  report += '</details>\n\n';
  report += '<!-- lighthouse-audit-comment -->';

  return report;
}

function main() {
  const args = process.argv.slice(2);
  const inputPath = args[0] || './reports/comparison.json';
  const outputPath = args[1] || './reports/comment.md';

  const comparisons = JSON.parse(readFileSync(inputPath, 'utf8'));

  const report = formatReport(comparisons);

  writeFileSync(outputPath, report);

  console.log(`PR comment formatted: ${outputPath}`);
}

main();
