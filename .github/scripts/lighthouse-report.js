#!/usr/bin/env node

/**
 * Lighthouse Report Formatter
 * Generates formatted markdown reports from Lighthouse CI outputs
 */

// Parse command-line arguments
const [manifestJson, linksJson, baselineManifestJson, baselineLinksJson] = process.argv.slice(2);

// Score thresholds
const SCORE_THRESHOLDS = {
  GOOD: 0.9,
  NEEDS_IMPROVEMENT: 0.5,
  WARNING: 0.8
};

/**
 * Safely parse JSON with descriptive error messages
 * @param {string} jsonString - JSON string to parse
 * @param {string} paramName - Parameter name for error messages
 * @returns {*} Parsed JSON
 * @throws {Error} If JSON parsing fails
 */
function safeJsonParse(jsonString, paramName) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Failed to parse ${paramName}: ${error.message}`);
  }
}

/**
 * Filter manifest to only representative runs
 * @param {Array} manifest - Full Lighthouse manifest array
 * @returns {Array} Filtered manifest with only representative runs
 */
function getRepresentativeRuns(manifest) {
  return manifest.filter((result) => result.isRepresentativeRun === true);
}

/**
 * Validate manifest structure and check for NaN values
 * @param {Array} manifest - Lighthouse manifest array
 * @throws {Error} If manifest is invalid or contains NaN values
 */
function validateManifest(manifest) {
  if (!Array.isArray(manifest)) {
    throw new Error('Manifest must be an array');
  }

  manifest.forEach((result, index) => {
    if (!result.url) {
      throw new Error(`Manifest entry ${index} missing URL`);
    }
    if (!result.summary) {
      throw new Error(`Manifest entry ${index} missing summary`);
    }

    const summary = result.summary;
    const requiredMetrics = ['performance', 'accessibility', 'best-practices', 'seo'];

    requiredMetrics.forEach((metric) => {
      const value = summary[metric];
      if (typeof value !== 'number' || isNaN(value)) {
        throw new Error(`Invalid ${metric} value in manifest entry ${index}: ${value} (must be a number, not NaN)`);
      }
    });
  });
}

/**
 * Validate links structure
 * @param {Object} links - Links object to validate
 * @throws {Error} If links is invalid
 */
function validateLinks(links) {
  if (!links || typeof links !== 'object') {
    throw new Error('Links must be a non-null object');
  }
  Object.entries(links).forEach(([url, link]) => {
    if (typeof link !== 'string') {
      throw new Error(`Invalid link for URL ${url}: must be string`);
    }
  });
}

/**
 * Extract URL path from full URL
 * @param {string} url - Full URL
 * @returns {string} URL pathname
 */
function extractUrlPath(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname || '/';
  } catch {
    return url;
  }
}

/**
 * Format a score (0-1) with visual indicator
 * @param {number} score - Score value (0-1)
 * @param {number} [baseline] - Optional baseline score for comparison
 * @returns {string} Formatted score string
 */
function formatScore(score, baseline) {
  if (typeof score !== 'number' || isNaN(score)) {
    throw new Error(`Invalid score: ${score}`);
  }

  const percentage = Math.round(score * 100);
  let emoji;

  if (score >= SCORE_THRESHOLDS.GOOD) {
    emoji = '🟢';
  } else if (score >= SCORE_THRESHOLDS.NEEDS_IMPROVEMENT) {
    emoji = '🟠';
  } else {
    emoji = '🔴';
  }

  let formatted = `${emoji} ${percentage}`;

  if (baseline !== undefined && baseline !== null && typeof baseline === 'number' && !isNaN(baseline)) {
    const delta = score - baseline;
    const deltaPercentage = Math.round(delta * 100);

    if (deltaPercentage > 0) {
      formatted += ` (📈 +${deltaPercentage})`;
    } else if (deltaPercentage < 0) {
      formatted += ` (📉 ${deltaPercentage})`;
    } else {
      formatted += ` (➡️ ${deltaPercentage})`;
    }
  }

  return formatted;
}

/**
 * Generate markdown table from rows
 * @param {Array<string>} headers - Table headers
 * @param {Array<Array<string>>} rows - Table rows
 * @returns {string} Markdown table string
 */
function generateMarkdownTable(headers, rows) {
  const headerRow = `| ${headers.join(' | ')} |`;
  const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
  const dataRows = rows.map((row) => `| ${row.join(' | ')} |`).join('\n');

  return `${headerRow}\n${separatorRow}\n${dataRows}`;
}

/**
 * Main report formatting function
 * @param {Object} input - Input data
 * @returns {string} Formatted markdown report
 */
function formatLighthouseReport(input) {
  const { current, baseline } = input;

  validateManifest(current.manifest);
  validateLinks(current.links);

  if (baseline && baseline.manifest) {
    validateManifest(baseline.manifest);
    validateLinks(baseline.links);
  }

  // Filter to only representative runs
  const currentManifest = getRepresentativeRuns(current.manifest);
  const baselineManifest = baseline && baseline.manifest ? getRepresentativeRuns(baseline.manifest) : [];

  const hasBaseline = baselineManifest.length > 0;

  // Build baseline lookup map for O(1) access
  const baselineMap = new Map();
  if (hasBaseline) {
    baselineManifest.forEach((result) => baselineMap.set(result.url, result));
  }

  let report = '## 🔦 Lighthouse Performance Report\n\n';

  // Add summary section
  if (currentManifest.length > 0) {
    const scores = currentManifest.map((r) => r.summary.performance);
    const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100);
    const failingCount = scores.filter((s) => s < SCORE_THRESHOLDS.WARNING).length;
    const goodCount = scores.filter((s) => s >= SCORE_THRESHOLDS.GOOD).length;

    report += '**Quick Summary**: ';
    if (failingCount === 0 && goodCount === currentManifest.length) {
      report += `✅ All ${currentManifest.length} pages passed (avg: ${avgScore})`;
    } else if (failingCount > 0) {
      report += `⚠️ ${failingCount} page${failingCount > 1 ? 's' : ''} below threshold (avg: ${avgScore})`;
    } else {
      report += `🟠 Needs improvement (avg: ${avgScore})`;
    }
    report += '\n\n';
  }

  // Performance Scores Table
  report += '<details open>\n<summary><strong>Performance Scores</strong></summary>\n\n';
  const scoreHeaders = ['URL', 'Performance', 'Accessibility', 'Best Practices', 'SEO'];
  const scoreRows = [];

  currentManifest.forEach((result) => {
    const urlPath = extractUrlPath(result.url);
    const baselineResult = baselineMap.get(result.url);

    const row = [
      urlPath,
      formatScore(result.summary.performance, baselineResult?.summary.performance),
      formatScore(result.summary.accessibility, baselineResult?.summary.accessibility),
      formatScore(result.summary['best-practices'], baselineResult?.summary['best-practices']),
      formatScore(result.summary.seo, baselineResult?.summary.seo)
    ];

    scoreRows.push(row);
  });

  report += generateMarkdownTable(scoreHeaders, scoreRows);
  report += '\n</details>\n\n';

  // Full Reports Table
  report += '<details>\n<summary><strong>Full Reports</strong></summary>\n\n';
  const reportsHeaders = hasBaseline ? ['URL', 'PR Build', 'Main Branch'] : ['URL', 'Current Build', 'Baseline'];
  const reportsRows = [];

  Object.keys(current.links).forEach((url) => {
    const urlPath = extractUrlPath(url);
    const currentLink = current.links[url] || 'N/A';
    const baselineLink = (hasBaseline && baseline.links[url]) || 'N/A';

    const row = [
      urlPath,
      currentLink !== 'N/A' ? `[View Report](${currentLink})` : 'N/A',
      baselineLink !== 'N/A' ? `[View Report](${baselineLink})` : 'N/A'
    ];

    reportsRows.push(row);
  });

  report += generateMarkdownTable(reportsHeaders, reportsRows);
  report += '\n</details>\n\n---\n';

  // Summary Footer
  if (hasBaseline) {
    report +=
      '*📊 Metrics compared against `main` branch • 🟢 Good (≥90) • 🟠 Needs Improvement (50-89) • 🔴 Poor (<50)*\n';
    report += '*📈 Better than main • 📉 Worse than main • ➡️ No change*\n';
  } else {
    report +=
      '*📊 No baseline available for comparison • 🟢 Good (≥90) • 🟠 Needs Improvement (50-89) • 🔴 Poor (<50)*\n';
  }

  return report;
}

// Main execution
try {
  if (!manifestJson || !linksJson) {
    console.error('Usage: lighthouse-report.js <manifest> <links> [baseline-manifest] [baseline-links]');
    console.error('');
    console.error('Arguments:');
    console.error('  manifest            JSON string of Lighthouse manifest output');
    console.error('  links               JSON string of Lighthouse links output');
    console.error('  baseline-manifest   (Optional) JSON string of baseline manifest');
    console.error('  baseline-links      (Optional) JSON string of baseline links');
    process.exit(1);
  }

  const input = {
    current: {
      manifest: safeJsonParse(manifestJson, 'manifest'),
      links: safeJsonParse(linksJson, 'links')
    },
    baseline:
      baselineManifestJson && baselineManifestJson !== ''
        ? {
            manifest: safeJsonParse(baselineManifestJson, 'baseline-manifest'),
            links: safeJsonParse(baselineLinksJson || '{}', 'baseline-links')
          }
        : undefined
  };

  const report = formatLighthouseReport(input);
  console.log(report);
  process.exit(0);
} catch (error) {
  console.error('Error generating Lighthouse report:', error.message);
  console.error('');
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
