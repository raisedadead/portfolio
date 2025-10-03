#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LIGHTHOUSE_DIR = '.lighthouseci';

function extractUrlPath(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname || '/';
  } catch {
    return url;
  }
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function loadLighthouseReports() {
  const files = readdirSync(LIGHTHOUSE_DIR);
  const jsonFiles = files.filter((f) => f.startsWith('lhr-') && f.endsWith('.json'));

  return jsonFiles.map((file) => {
    const content = readFileSync(join(LIGHTHOUSE_DIR, file), 'utf8');
    const report = JSON.parse(content);

    return {
      url: report.finalUrl || report.requestedUrl || report.mainDocumentUrl,
      fetchTime: report.fetchTime,
      categories: {
        performance: report.categories.performance.score,
        accessibility: report.categories.accessibility.score,
        'best-practices': report.categories['best-practices'].score,
        seo: report.categories.seo.score
      }
    };
  });
}

function groupByUrl(reports) {
  const groups = new Map();

  reports.forEach((report) => {
    const urlPath = extractUrlPath(report.url);
    if (!groups.has(urlPath)) {
      groups.set(urlPath, []);
    }
    groups.get(urlPath).push(report);
  });

  return groups;
}

function calculateMedians(urlGroups) {
  const manifest = [];

  urlGroups.forEach((reports, urlPath) => {
    const categoryScores = {
      performance: [],
      accessibility: [],
      'best-practices': [],
      seo: []
    };

    reports.forEach((report) => {
      Object.entries(report.categories).forEach(([category, score]) => {
        categoryScores[category].push(score);
      });
    });

    manifest.push({
      url: urlPath,
      fetchTime: reports[0].fetchTime,
      summary: {
        performance: median(categoryScores.performance),
        accessibility: median(categoryScores.accessibility),
        'best-practices': median(categoryScores['best-practices']),
        seo: median(categoryScores.seo)
      }
    });
  });

  return manifest;
}

function main() {
  const outputPath = process.argv[2] || '.lighthouseci/manifest.json';

  console.log('Loading Lighthouse reports...');
  const reports = loadLighthouseReports();
  console.log(`Loaded ${reports.length} reports`);

  console.log('Grouping reports by URL...');
  const urlGroups = groupByUrl(reports);
  console.log(`Found ${urlGroups.size} unique URLs`);

  console.log('Calculating median scores...');
  const manifest = calculateMedians(urlGroups);

  writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  console.log(`Manifest written to ${outputPath}`);
}

main();
