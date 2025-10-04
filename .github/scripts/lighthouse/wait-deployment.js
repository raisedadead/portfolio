#!/usr/bin/env node

const COMMIT_SHA = process.argv[2];
const TIMEOUT = parseInt(process.argv[3] || '600', 10);
const POLL_INTERVAL = parseInt(process.argv[4] || '30', 10);

if (!COMMIT_SHA) {
  console.error('Error: COMMIT_SHA is required');
  process.exit(1);
}

if (TIMEOUT <= 0 || POLL_INTERVAL <= 0) {
  console.error('Error: TIMEOUT and POLL_INTERVAL must be positive integers');
  process.exit(1);
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || 'raisedadead/portfolio';

if (!GITHUB_TOKEN) {
  console.error('Error: GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getCloudflareCheckStatus(commitSha) {
  try {
    const [owner, repo] = GITHUB_REPOSITORY.split('/');
    const url = `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}/check-runs`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return { status: null, conclusion: null };
    }

    const data = await response.json();

    if (!data.check_runs) {
      console.error('No check runs found in response');
      return { status: null, conclusion: null };
    }

    const cloudflareCheck = data.check_runs.find((check) => check.name && check.name.startsWith('Workers Builds:'));

    if (!cloudflareCheck) {
      return { status: null, conclusion: null };
    }

    return {
      status: cloudflareCheck.status,
      conclusion: cloudflareCheck.conclusion
    };
  } catch (error) {
    console.error(`Error fetching check status: ${error.message}`);
    return { status: null, conclusion: null };
  }
}

async function main() {
  console.log(`Waiting for Cloudflare deployment of commit ${COMMIT_SHA} (timeout: ${TIMEOUT}s)...`);

  let elapsed = 0;

  while (elapsed < TIMEOUT) {
    const { status, conclusion } = await getCloudflareCheckStatus(COMMIT_SHA);

    if (status === 'completed') {
      if (conclusion === 'success') {
        console.log('Cloudflare deployment successful');
        console.log('Waiting 30s for CDN caches to warm up...');
        await sleep(30000);
        console.log('Ready for Lighthouse audits');
        process.exit(0);
      } else {
        console.error(`Cloudflare deployment failed with conclusion: ${conclusion}`);
        process.exit(1);
      }
    }

    console.log(`Cloudflare deployment status: ${status || 'pending'} (${elapsed}s elapsed)`);
    await sleep(POLL_INTERVAL * 1000);
    elapsed += POLL_INTERVAL;
  }

  console.error(`Error: Cloudflare deployment timed out after ${TIMEOUT} seconds`);
  process.exit(1);
}

main();
