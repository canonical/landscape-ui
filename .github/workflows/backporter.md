---
# gh-aw v0.88.7 source. Regenerate backporter.lock.yml with:
# gh aw compile backporter --strict
description: Opens backport PRs for merged PRs with bare unchecked release entries, and links existing backports into the source checklist.

on:
  push:
    branches: [main]
  schedule: daily
  workflow_dispatch:
    inputs:
      pr_number:
        description: Merged PR number to backport (also retries failed targets)
        required: true
        type: string

engine:
  id: copilot
  model: sonnet
  agent: backporter

imports:
  - .github/agents/backporter.agent.md

concurrency:
  group: backporter
  cancel-in-progress: false
  job-discriminator: ${{ github.run_id }}

permissions:
  contents: read
  issues: read
  pull-requests: read

checkout:
  fetch-depth: 0

network:
  allowed:
    - defaults
    # Git-over-HTTPS is not included in v0.88.7's defaults.
    - github.com

tools:
  bash:
    - "git"
  edit:

jobs:
  find-backports:
    runs-on: ubuntu-latest
    # Share this writer lock with backporter-link.yaml to prevent lost links.
    concurrency:
      group: backporter-source-body
      cancel-in-progress: false
    permissions:
      contents: read
      issues: read
      # Links existing PRs and reports invalid targets without invoking the agent.
      pull-requests: write
    outputs:
      todo: ${{ steps.find.outputs.todo }}
      has_todo: ${{ steps.find.outputs.has_todo }}
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          sparse-checkout: .github/scripts/backporter
          persist-credentials: false
      - id: find
        uses: actions/github-script@3a2844b7e9c422d3c10d287c895573f7108da1b3 # v9.0.0
        with:
          script: |
            const { findBackports } = require(`${process.env.GITHUB_WORKSPACE}/.github/scripts/backporter/backport.cjs`);
            await findBackports({ github, context, core });

  agent:
    needs: [find-backports]
    if: needs.find-backports.outputs.has_todo == 'true'

safe-outputs:
  # A repository-scoped PAT/App token lets the opened PRs trigger release CI.
  github-token: ${{ secrets.BACKPORTER_TOKEN }}
  create-pull-request:
    max: 10
    # v0.88.7 only supports exact names and '*', not [0-9] or '+'.
    # Keep this exact list equal to backport.cjs's BACKPORT_BRANCHES.
    allowed-base-branches: ["release/26.10", "point/26.04.2"]
    preserve-branch-name: true
    draft: false
    labels: [backport, automation]
    team-reviewers: [canonical/landscape-ui]
    fallback-as-issue: false
    signed-commits: false
    protected-files:
      exclude:
        - package.json
        - pnpm-lock.yaml
  add-comment:
    target: "*"
    max: 10
---

Follow the instructions in the imported agent file.
