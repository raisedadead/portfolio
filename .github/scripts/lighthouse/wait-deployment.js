#!/usr/bin/env node

import { execSync } from 'node:child_process';

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

if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
  console.error('Error: CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID environment variables are required');
  process.exit(1);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDeploymentStatus(commitSha) {
  try {
    const output = execSync('pnpm exec wrangler pages deployment list --format=json', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env }
    });

    const deployments = JSON.parse(output);
    const deployment = deployments.find((d) => d.deployment_trigger?.metadata?.commit_hash === commitSha);

    if (!deployment) {
      return { status: null, url: null };
    }

    return {
      status: deployment.latest_stage?.status || null,
      url: deployment.url || null
    };
  } catch (error) {
    console.error(`Error fetching deployment status: ${error.message}`);
    return { status: null, url: null };
  }
}

async function main() {
  console.log(`Waiting for Cloudflare deployment of commit ${COMMIT_SHA} (timeout: ${TIMEOUT}s)...`);

  let elapsed = 0;

  while (elapsed < TIMEOUT) {
    const { status, url } = getDeploymentStatus(COMMIT_SHA);

    if (status === 'success') {
      console.log(`Deployment successful: ${url}`);
      process.exit(0);
    }

    if (status === 'failure') {
      console.error(`Error: Deployment failed for commit ${COMMIT_SHA}`);
      process.exit(1);
    }

    console.log(`Deployment status: ${status || 'pending'} (${elapsed}s elapsed)`);
    await sleep(POLL_INTERVAL * 1000);
    elapsed += POLL_INTERVAL;
  }

  console.error(`Error: Deployment timed out after ${TIMEOUT} seconds`);
  process.exit(1);
}

main();
