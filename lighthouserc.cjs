// Lighthouse CI config: serves the production build via `vite preview`, runs
// Lighthouse against a set of public routes, and asserts that the accessibility
// score stays at or above the configured floor.
//
// Run locally with `pnpm a11y:ci`. Run in CI via .github/workflows/lighthouse-a11y.yml.

const fs = require("node:fs");
const path = require("node:path");

// Point Lighthouse at Playwright's bundled Chromium when no system Chrome
// install is present. Playwright is already a devDependency, so this works
// for any contributor who has run `pnpm install`.
if (!process.env.CHROME_PATH) {
  try {
    const playwrightChrome = require("@playwright/test").chromium.executablePath();
    if (playwrightChrome && fs.existsSync(playwrightChrome)) {
      process.env.CHROME_PATH = playwrightChrome;
    }
  } catch {
    // @playwright/test not installed — let lhci fall back to its own lookup.
  }
}

// VITE_ROOT_PATH determines where the SPA mounts (e.g. `/new_dashboard/`), and
// thus what URL Lighthouse must hit. Read it from the same .env files Vite
// uses for a production build so local and CI stay in sync.
function loadViteEnv() {
  const files = [
    ".env",
    ".env.local",
    ".env.production",
    ".env.production.local",
  ];
  const env = {};
  for (const name of files) {
    const p = path.join(__dirname, name);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m) env[m[1]] = m[2].trim();
    }
  }
  return env;
}

const rawRootPath = loadViteEnv().VITE_ROOT_PATH || "/";
const rootPath =
  rawRootPath === "/" ? "" : rawRootPath.replace(/\/+$/, "");

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Public, unauthenticated routes — they don't require an active session, so
// they render without MSW or API mocks. Override with LIGHTHOUSE_PATHS=
// "/login,/create-account" if you want a different set.
const paths = (
  process.env.LIGHTHOUSE_PATHS ?? "/login,/create-account,/no-access"
)
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

// Score floor: any audited page that drops below this fails the run. Default
// is "no regression from a perfect score." Tune via LIGHTHOUSE_MIN_SCORE.
const MIN_SCORE = Number(process.env.LIGHTHOUSE_MIN_SCORE ?? 1.0);

module.exports = {
  ci: {
    collect: {
      startServerCommand: `pnpm exec vite preview --host 127.0.0.1 --port ${PORT}`,
      startServerReadyPattern: "Local:",
      startServerReadyTimeout: 60000,
      url: paths.map((p) => `${BASE_URL}${rootPath}${p}`),
      numberOfRuns: 1,
      settings: {
        onlyCategories: ["accessibility"],
        chromeFlags: "--no-sandbox --disable-gpu --headless",
      },
    },
    assert: {
      assertions: {
        "categories:accessibility": ["error", { minScore: MIN_SCORE }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./.lighthouseci",
      reportFilenamePattern: "%%PATHNAME%%-report.%%EXTENSION%%",
    },
  },
};
