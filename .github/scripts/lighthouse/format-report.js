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

  const rows = [];
  grouped.forEach((categories, url) => {
    const perf = formatScoreCell(categories.performance);
    const a11y = formatScoreCell(categories.accessibility);
    const bp = formatScoreCell(categories['best-practices']);
    const seo = formatScoreCell(categories.seo);

    rows.push(`| ${url} | ${perf} | ${a11y} | ${bp} | ${seo} |`);
  });

  return `
**Lighthouse Audit Results**

---

**Summary**: ${passingUrls}/${totalUrls} pages passing (avg: ${avgScore})

| URL | Perf | A11y | Best Practices | SEO |
|-----|------|------|----------------|-----|
${rows.join('\n')}

<!-- lighthouse-audit-comment -->`;
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
