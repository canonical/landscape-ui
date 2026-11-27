#!/usr/bin/env bash
set -euo pipefail

name=$1
job=$2
if [[ "$GITHUB_RUN_ATTEMPT" == 1 ]]; then exit 0; fi

run="repos/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID"
artifact=$(gh api --paginate "$run/artifacts?name=$name" \
  --jq '.artifacts[] | [.id, .expired, .digest] | @tsv')
if [[ -n "$artifact" ]]; then
  IFS=$'\t' read -r id expired digest <<< "$artifact"
  if [[ "$expired" == false && "$digest" == sha256:* && "$artifact" != *$'\n'* ]]; then
    echo "Reusing $name artifact $id ($digest)"
    echo "id=$id" >> "$GITHUB_OUTPUT"
    exit 0
  fi
  echo "::error::Original $name artifact is unavailable or ambiguous."
  exit 1
fi

# A build/packaging job can be retried if it never produced its artifact.
# Stop if its artifact upload previously completed or any PPA upload ran.
history=$(gh api --paginate "$run/jobs?filter=all" --jq \
  ".jobs[] | select(.run_attempt < $GITHUB_RUN_ATTEMPT) |
   select((.name == \"$job\" and any(.steps[]?; .name == \"Retain $name\" and .conclusion == \"success\")) or
          any(.steps[]?; .name == \"Sign, upload and check Launchpad acceptance\" and .conclusion != \"skipped\")) | .id")
if [[ -n "$history" ]]; then
  echo "::error::Original $name artifact is missing. Do not rebuild after publication may have started."
  exit 1
fi
