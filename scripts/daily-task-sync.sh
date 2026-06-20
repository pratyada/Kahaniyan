#!/bin/bash
# Daily task sync — runs at 9 PM ET via CloudWatch cron.
# Reads git commits from last 24h, sends to /api/daily-task-sync to create tasks.
# Usage: bash scripts/daily-task-sync.sh

set -e

API_URL="https://mysleepytale.com/api/daily-task-sync"
REPO_DIR="/Users/prat/Documents/sudo/kahaniyan"

cd "$REPO_DIR"

echo "📋 Daily Task Sync — $(date)"
echo "Reading git commits from last 24 hours..."

# Get commits from last 24h as JSON array
COMMITS=$(git log --since="24 hours ago" --pretty=format:'{"hash":"%H","shortHash":"%h","author":"%an","date":"%ai","message":"%s"}' | \
  sed 's/\\/\\\\/g' | \
  jq -s '.')

COUNT=$(echo "$COMMITS" | jq 'length')
echo "Found $COUNT commits"

if [ "$COUNT" -eq "0" ]; then
  echo "No commits in last 24h. Nothing to sync."
  exit 0
fi

# Send to API
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"commits\": $COMMITS}")

echo "API Response: $RESPONSE"
echo "✅ Task sync complete"
