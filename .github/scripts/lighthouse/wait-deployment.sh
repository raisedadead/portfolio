#!/usr/bin/env bash

set -euo pipefail

COMMIT_SHA="${1:?Error: COMMIT_SHA is required}"
TIMEOUT="${2:-600}"
POLL_INTERVAL="${3:-30}"

ELAPSED=0

echo "Waiting for Cloudflare deployment of commit $COMMIT_SHA (timeout: ${TIMEOUT}s)..."

while [[ $ELAPSED -lt $TIMEOUT ]]; do
	STATUS=$(pnpm exec wrangler pages deployment list --format=json 2>/dev/null | \
		jq -r --arg sha "$COMMIT_SHA" '.[] | select(.deployment_trigger.metadata.commit_hash == $sha) | .latest_stage.status' | \
		head -n 1)

	if [[ "$STATUS" == "success" ]]; then
		DEPLOYMENT_URL=$(pnpm exec wrangler pages deployment list --format=json 2>/dev/null | \
			jq -r --arg sha "$COMMIT_SHA" '.[] | select(.deployment_trigger.metadata.commit_hash == $sha) | .url' | \
			head -n 1)
		echo "Deployment successful: $DEPLOYMENT_URL"
		exit 0
	fi

	if [[ "$STATUS" == "failure" ]]; then
		echo "Error: Deployment failed for commit $COMMIT_SHA"
		exit 1
	fi

	echo "Deployment status: ${STATUS:-pending} (${ELAPSED}s elapsed)"
	sleep "$POLL_INTERVAL"
	ELAPSED=$((ELAPSED + POLL_INTERVAL))
done

echo "Error: Deployment timed out after ${TIMEOUT} seconds"
exit 1
