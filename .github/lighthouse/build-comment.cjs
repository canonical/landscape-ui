#!/usr/bin/env node
// Sticky-PR-comment generator for Lighthouse a11y runs.
//
// Reads `manifest.json` + sibling `lhr-*.json` files produced by
// `lhci upload --target=filesystem`, then writes a Markdown table to stdout.
//
// Env:
//   LHCI_MODE          'block' | 'annotate' (default: 'annotate' — the safer
//                      default; matches the PR workflow's default mode)
//   LHCI_ARTIFACT_URL  optional URL to a workflow artifact; embedded as a link
//   LHCI_RESULTS_DIR   optional override of the manifest directory (default
//                      './.lighthouseci') — used by tests to point at fixtures
//   LHCI_MANIFEST_FILE optional override of the manifest filename (default
//                      'manifest.json') — used by tests so several fixtures
//                      can sit in one directory
//
// Failure modes:
//   - Missing manifest → short warning Markdown, exit 0.
//   - Any other error  → short warning Markdown to stdout, error to stderr,
//                        exit 0. The comment step must never fail the parent
//                        workflow.

const fs = require("fs");
const path = require("path");

// WCAG mapping mirrors the inline comments in `audit-sets.cjs`.
// Kept here as a self-contained lookup so this script needs no `npm install`.
const WCAG_MAP = {
  "image-alt": "1.1.1",
  "document-title": "2.4.2",
  "html-has-lang": "3.1.1",
  "link-name": "2.4.4",
  "button-name": "4.1.2",
  "valid-lang": "3.1.2",
  "meta-viewport": "1.4.4",
  "color-contrast": "1.4.3",
  label: "1.3.1",
  "aria-allowed-attr": "4.1.2",
  "aria-required-attr": "4.1.2",
  "aria-roles": "4.1.2",
  "aria-valid-attr": "4.1.2",
  "aria-valid-attr-value": "4.1.2",
  "aria-hidden-body": "4.1.2",
  "aria-hidden-focus": "4.1.2",
  tabindex: "2.4.3",
  "frame-title": "2.4.1",
  bypass: "2.4.1",
  "definition-list": "1.3.1",
  dlitem: "1.3.1",
  "duplicate-id-aria": "4.1.1",
  "form-field-multiple-labels": "3.3.2",
  list: "1.3.1",
  listitem: "1.3.1",
  "target-size": "2.5.5",
  "focus-traps": "2.1.2",
  "focusable-controls": "2.1.1",
  "heading-order": "1.3.1",
  "skip-link": "2.4.1",
  "use-landmarks": "1.3.1",
};

const MAX_AUDITS_PER_ROW = 3;
const GREEN_THRESHOLD = 0.95;
const AMBER_THRESHOLD = 0.85;

function emojiForScore(score) {
  if (score >= GREEN_THRESHOLD) return "🟢";
  if (score >= AMBER_THRESHOLD) return "🟡";
  return "🔴";
}

function banner(mode) {
  if (mode === "block") {
    return "### 🔦 Lighthouse a11y — Blocking";
  }
  return "### 🔦 Lighthouse a11y — Annotate-only (not blocking)";
}

function pathOfUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    return parsed.pathname || "/";
  } catch {
    return rawUrl;
  }
}

function formatAudit(auditId) {
  const wcag = WCAG_MAP[auditId];
  return wcag ? `\`${auditId}\` (WCAG ${wcag})` : `\`${auditId}\``;
}

function failingAudits(lhr) {
  const audits = lhr && lhr.audits ? lhr.audits : {};
  const failing = [];
  for (const [id, audit] of Object.entries(audits)) {
    if (audit && typeof audit.score === "number" && audit.score < 1) {
      failing.push(id);
    }
  }
  return failing;
}

function renderRow(entry, lhr) {
  const score = entry.summary && entry.summary.accessibility;
  const emoji = emojiForScore(score);
  const scoreCell = `${emoji} ${score.toFixed(2)}`;

  const failing = failingAudits(lhr);
  let auditsCell;
  if (failing.length === 0) {
    auditsCell = "—";
  } else {
    const shown = failing
      .slice(0, MAX_AUDITS_PER_ROW)
      .map(formatAudit)
      .join(", ");
    const extra = failing.length - MAX_AUDITS_PER_ROW;
    auditsCell = extra > 0 ? `${shown} (+${extra} more)` : shown;
  }

  return `| \`${pathOfUrl(entry.url)}\` | ${scoreCell} | ${auditsCell} |`;
}

function resolveLhrPath(resultsDir, manifestEntry) {
  const raw = manifestEntry.jsonPath || "";
  // LHCI writes paths like `.lighthouseci/lhr-foo.json`; tests put the lhr
  // files alongside the manifest. Try both shapes.
  const candidates = [
    path.resolve(resultsDir, path.basename(raw)),
    path.resolve(resultsDir, raw),
    path.resolve(process.cwd(), raw),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function buildComment({ resultsDir, mode, artifactUrl, manifestFile }) {
  const manifestPath = path.resolve(resultsDir, manifestFile || "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    return (
      `${banner(mode)}\n\n` +
      "> Lighthouse did not produce a manifest; see the job logs for details.\n"
    );
  }

  const manifest = loadJson(manifestPath);

  const lines = [
    banner(mode),
    "",
    "| URL | Score | Top failing audits |",
    "| --- | :---: | --- |",
  ];

  for (const entry of manifest) {
    const lhrPath = resolveLhrPath(resultsDir, entry);
    const lhr = lhrPath ? loadJson(lhrPath) : null;
    lines.push(renderRow(entry, lhr));
  }

  if (artifactUrl) {
    lines.push("", `[Full report artifact](${artifactUrl})`);
  }

  return lines.join("\n") + "\n";
}

function main() {
  const resultsDir = process.env.LHCI_RESULTS_DIR || "./.lighthouseci";
  const mode = process.env.LHCI_MODE;
  const artifactUrl = process.env.LHCI_ARTIFACT_URL;
  const manifestFile = process.env.LHCI_MANIFEST_FILE;

  try {
    const output = buildComment({
      resultsDir,
      mode,
      artifactUrl,
      manifestFile,
    });
    process.stdout.write(output);
  } catch (err) {
    process.stderr.write(`build-comment: ${err && err.message}\n`);
    process.stdout.write(
      `${banner(mode)}\n\n` +
        "> Lighthouse comment generation failed; see the job logs for details.\n",
    );
  }
  process.exit(0);
}

module.exports = { buildComment, WCAG_MAP, emojiForScore, banner, main };

if (require.main === module) {
  main();
}
