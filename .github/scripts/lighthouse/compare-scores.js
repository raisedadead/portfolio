#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';

const THRESHOLDS = {
  performance: 85,
  accessibility: 90,
  'best-practices': 85,
  seo: 90
};

function convertScore(decimalScore) {
  return Math.round(decimalScore * 100);
}

function determineStatus(score, category) {
  const threshold = THRESHOLDS[category];
  if (score >= 90) return 'pass';
  if (score >= threshold) return 'warn';
  return 'fail';
}

function getIndicator(status) {
  const indicators = {
    pass: '🟢',
    warn: '🟡',
    fail: '🔴'
  };
  return indicators[status];
}

function extractUrlPath(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname || '/';
  } catch {
    return url;
  }
}

function loadManifest(manifestPath) {
  try {
    const content = readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(content);

    // Validate manifest is an array
    if (!Array.isArray(manifest)) {
      console.error(`Error: Manifest at ${manifestPath} is not an array`);
      return null;
    }

    return manifest
      .map((run) => {
        const url = run.url || run.requestedUrl || run.finalUrl;

        // Validate required fields
        if (!url) {
          console.warn('Warning: Manifest entry missing URL, skipping');
          return null;
        }
        if (!run.summary) {
          console.warn(`Warning: Manifest entry for ${url} missing summary, skipping`);
          return null;
        }

        return {
          url: extractUrlPath(url),
          categories: {
            performance: { score: run.summary.performance },
            accessibility: { score: run.summary.accessibility },
            'best-practices': { score: run.summary['best-practices'] },
            seo: { score: run.summary.seo }
          }
        };
      })
      .filter(Boolean); // Remove null entries
  } catch (error) {
    console.error(`Error loading manifest from ${manifestPath}: ${error.message}`);
    return null;
  }
}

function compareScores(currentReports, baselineReports) {
  const baselineMap = new Map();

  if (baselineReports) {
    baselineReports.forEach((report) => {
      baselineMap.set(report.url, report.categories);
    });
  }

  const comparisons = [];

  currentReports.forEach((currentReport) => {
    const urlPath = currentReport.url;
    const baselineCategories = baselineMap.get(urlPath);

    Object.entries(currentReport.categories).forEach(([category, data]) => {
      const currentScore = convertScore(data.score);
      const baselineScore = baselineCategories?.[category] ? convertScore(baselineCategories[category].score) : null;
      const delta = baselineScore !== null ? currentScore - baselineScore : null;
      const status = determineStatus(currentScore, category);
      const indicator = getIndicator(status);

      comparisons.push({
        url: urlPath,
        category,
        current: currentScore,
        baseline: baselineScore,
        delta,
        status,
        indicator
      });
    });
  });

  return comparisons;
}

function main() {
  const args = process.argv.slice(2);
  const currentManifestPath = args[0] || '.lighthouseci/manifest.json';
  const baselineManifestPath = args[1] || 'baseline-manifest.json';
  const outputPath = args[2] || 'comparison.json';

  const currentReports = loadManifest(currentManifestPath);
  const baselineReports = loadManifest(baselineManifestPath);

  if (!currentReports) {
    console.error(`Error: Could not load current manifest from ${currentManifestPath}`);
    process.exit(1);
  }

  const comparisons = compareScores(currentReports, baselineReports);

  writeFileSync(outputPath, JSON.stringify(comparisons, null, 2));

  console.log(`Score comparison complete: ${outputPath}`);
  console.log(`Total comparisons: ${comparisons.length}`);
}

main();
