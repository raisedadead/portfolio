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

function formatReport(comparisons, mode = 'pr') {
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

  if (mode === 'production') {
    return formatProductionReport(rows, passingUrls, totalUrls, avgScore, failures, regressions, hasBaseline);
  }

  let report = '**Lighthouse Audit Results**\n\n';
  report += `**Summary**: ${passingUrls}/${totalUrls} pages passing (avg: ${avgScore})\n\n`;
  report += '| URL | Perf | A11y | Best Practices | SEO |\n';
  report += '|-----|------|------|----------------|-----|\n';
  report += `${rows.join('\n')}\n\n`;

  // Show warnings in expandable details
  if (failures.length > 0 || (hasBaseline && regressions.length > 0)) {
    const parts = [];
    if (failures.length > 0) {
      parts.push(`${failures.length} below threshold`);
    }
    if (hasBaseline && regressions.length > 0) {
      parts.push(`${regressions.length} regression${regressions.length > 1 ? 's' : ''}`);
    }

    report += '<details>\n';
    report += `<summary>WARNING: ${parts.join(' • ')}</summary>\n\n`;

    if (failures.length > 0) {
      report += '**Below threshold:**\n';
      failures.forEach((f) => {
        const categoryName =
          f.category === 'best-practices' ? 'Best Practices' : f.category.charAt(0).toUpperCase() + f.category.slice(1);
        report += `- \`${f.url}\` ${categoryName}: ${f.current}%\n`;
      });
      report += '\n';
    }

    if (hasBaseline && regressions.length > 0) {
      report += '**Regressions:**\n';
      regressions.forEach((r) => {
        const categoryName =
          r.category === 'best-practices' ? 'Best Practices' : r.category.charAt(0).toUpperCase() + r.category.slice(1);
        report += `- \`${r.url}\` ${categoryName}: ${r.delta}\n`;
      });
      report += '\n';
    }

    report += '</details>\n\n';
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

function formatProductionReport(rows, passingUrls, totalUrls, avgScore, failures, regressions, hasBaseline) {
  let report = '## Lighthouse Production Audit\n\n';
  report += `**Summary:** ${passingUrls}/${totalUrls} pages passing (avg: ${avgScore})\n\n`;
  report += '| URL | Perf | A11y | Best Practices | SEO |\n';
  report += '|-----|------|------|----------------|-----|\n';
  report += `${rows.join('\n')}\n\n`;

  if (failures.length > 0 || (hasBaseline && regressions.length > 0)) {
    report += '---\n\n';

    if (failures.length > 0) {
      report += `### WARNING: ${failures.length} metric${failures.length > 1 ? 's' : ''} below threshold\n\n`;
      failures.forEach((f) => {
        const categoryName =
          f.category === 'best-practices' ? 'Best Practices' : f.category.charAt(0).toUpperCase() + f.category.slice(1);
        const thresholds = { performance: 85, accessibility: 90, 'best-practices': 85, seo: 90 };
        report += `- \`${f.url}\` ${categoryName}: ${f.current}% (threshold: ${thresholds[f.category]}%)\n`;
      });
      report += '\n';
    }

    if (hasBaseline && regressions.length > 0) {
      report += `### CAUTION: ${regressions.length} metric${regressions.length > 1 ? 's' : ''} regressed from baseline\n\n`;
      regressions.forEach((r) => {
        const categoryName =
          r.category === 'best-practices' ? 'Best Practices' : r.category.charAt(0).toUpperCase() + r.category.slice(1);
        report += `- \`${r.url}\` ${categoryName}: ${r.current}% (${r.delta} from baseline)\n`;
      });
      report += '\n';
    }

    report += '---\n\n';
  }

  report += '<details>\n';
  report += '<summary>Legend</summary>\n\n';
  report += '**Thresholds:** Perf ≥85%, A11y ≥90%, Best Practices ≥85%, SEO ≥90%  \n';
  report += '**Indicators:** 🟢 Good (≥90%) • 🟡 Needs Improvement • 🔴 Below Threshold\n\n';
  report += '</details>\n';

  return report;
}

function main() {
  const args = process.argv.slice(2);
  const inputPath = args[0] || './reports/comparison.json';
  const outputPath = args[1] || './reports/comment.md';
  const mode = args[2] || 'pr';

  const comparisons = JSON.parse(readFileSync(inputPath, 'utf8'));

  const report = formatReport(comparisons, mode);

  writeFileSync(outputPath, report);

  console.log(`Report formatted (${mode}): ${outputPath}`);
}

main();
