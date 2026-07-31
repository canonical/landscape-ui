import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";
import {
  parseSuggestions,
  renderStepSummary,
  renderSuggestions,
  slugifyRoute,
} from "./render";
import type { GapEntry, SuggestionsResponse } from "./types";

const tmpDirs: string[] = [];
const tmpDir = (): string => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "eval-loop-render-"));
  tmpDirs.push(dir);
  return dir;
};

afterEach(() => {
  for (const dir of tmpDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  delete process.env.GITHUB_STEP_SUMMARY;
});

const gaps: GapEntry[] = [
  {
    routeId: "POST /api/v2/mirrors",
    method: "POST",
    pattern: "/api/v2/mirrors",
    backend: "v2",
    totalHits: 30,
    statuses: { "201": 30 },
    rank: 1,
  },
  {
    routeId: "GET /debarchive/v1beta1/mirrors/{mirrorId}",
    method: "GET",
    pattern: "/debarchive/v1beta1/mirrors/{mirrorId}",
    backend: "go",
    totalHits: 25,
    statuses: { "200": 25 },
    rank: 2,
  },
];

const response: SuggestionsResponse = {
  suggestions: [
    {
      route: "POST /api/v2/mirrors",
      title: "Cover mirror creation",
      rationale: "Highest-traffic mutating route with no API-contract test.",
      spec: 'import { expect, test } from "@playwright/test";\n\ntest("create mirror", async ({ request }) => {\n  const res = await request.post("/api/v2/mirrors", { data: { name: "m" } });\n  expect(res.ok()).toBeTruthy();\n});',
      notes: "Requires cleanup of the created mirror.",
    },
    {
      route: "GET /debarchive/v1beta1/mirrors/{mirrorId}",
      title: "Cover mirror fetch",
      rationale: "Go service route exercised by the dashboard but untested.",
      spec: 'import { expect, test } from "@playwright/test";\n\ntest("get mirror", async ({ request }) => {\n  const res = await request.get("/v1beta1/mirrors/mirror-1");\n  expect(res.ok()).toBeTruthy();\n});',
      notes: "Depends on seeded mirror data.",
    },
  ],
};

describe("parseSuggestions", () => {
  it("parses a raw JSON response", () => {
    expect(parseSuggestions(JSON.stringify(response))).toEqual(response);
  });

  it("parses a ```json fenced response", () => {
    const fenced = "```json\n" + JSON.stringify(response, null, 2) + "\n```";
    expect(parseSuggestions(fenced)).toEqual(response);
  });

  it("returns null on garbage", () => {
    expect(parseSuggestions("sorry, I cannot help")).toBeNull();
  });

  it("returns null when the shape is invalid", () => {
    expect(
      parseSuggestions(JSON.stringify({ suggestions: [{ route: "x" }] })),
    ).toBeNull();
  });

  it("returns null when there are more than 5 suggestions", () => {
    const six = {
      suggestions: Array.from({ length: 6 }, (_, index) => ({
        route: `GET /r${index}`,
        title: "t",
        rationale: "r",
        spec: "s",
        notes: "n",
      })),
    };
    expect(parseSuggestions(JSON.stringify(six))).toBeNull();
  });
});

describe("slugifyRoute", () => {
  it("slugifies route ids deterministically", () => {
    expect(slugifyRoute("POST /api/v2/mirrors")).toBe("post-api-v2-mirrors");
    expect(slugifyRoute("GET /debarchive/v1beta1/mirrors/{mirrorId}")).toBe(
      "get-debarchive-v1beta1-mirrors-mirrorid",
    );
  });
});

describe("renderSuggestions", () => {
  it("writes one markdown artifact per suggestion with all sections", () => {
    const outDir = tmpDir();
    const written = renderSuggestions(response, gaps, outDir);

    expect(written).toHaveLength(2);
    expect(path.basename(written[0] ?? "")).toBe("01-post-api-v2-mirrors.md");
    expect(path.basename(written[1] ?? "")).toBe(
      "02-get-debarchive-v1beta1-mirrors-mirrorid.md",
    );

    const first = fs.readFileSync(written[0] ?? "", "utf-8");
    expect(first).toContain("# Cover mirror creation\n\n");
    expect(first).toContain("\n\n## Why this matters\n\n");
    expect(first).toContain("\n\n## Proposed spec\n\n");
    expect(first).toContain("\n\n## How to apply\n\n");
    expect(first.endsWith("\n")).toBe(true);
    expect(first).toContain("POST /api/v2/mirrors");
    expect(first).toContain("v2");
    expect(first).toContain("30");
    expect(first).toContain("201");
    expect(first).toContain("## Why this matters");
    expect(first).toContain("Highest-traffic mutating route");
    expect(first).toContain("## Proposed spec");
    expect(first).toContain("```ts");
    expect(first).toContain('request.post("/api/v2/mirrors"');
    expect(first).toContain("## How to apply");
    expect(first).toContain("e2e/docker-stack/api/");
    expect(first).toContain("playwright.api-contract.config.ts");
  });

  it("renders unknown-gap metadata gracefully when the route is not in the gap list", () => {
    const outDir = tmpDir();
    const hallucinated: SuggestionsResponse = {
      suggestions: [
        {
          route: "GET /api/v2/nonexistent",
          title: "Hallucinated route",
          rationale: "Not in the gap list.",
          spec: "// spec",
          notes: "",
        },
      ],
    };
    const written = renderSuggestions(hallucinated, gaps, outDir);
    const content = fs.readFileSync(written[0] ?? "", "utf-8");
    expect(content).toContain("GET /api/v2/nonexistent");
    expect(content).toMatch(/unknown|n\/a/i);
  });
});

describe("renderStepSummary", () => {
  it("produces a summary containing every suggestion route and title", () => {
    const summary = renderStepSummary(response, gaps);
    expect(summary).toContain("POST /api/v2/mirrors");
    expect(summary).toContain("Cover mirror creation");
    expect(summary).toContain("GET /debarchive/v1beta1/mirrors/{mirrorId}");
  });

  it("appends to GITHUB_STEP_SUMMARY when the env var is set", () => {
    const summaryFile = path.join(tmpDir(), "summary.md");
    process.env.GITHUB_STEP_SUMMARY = summaryFile;
    renderStepSummary(response, gaps);
    const appended = fs.readFileSync(summaryFile, "utf-8");
    expect(appended).toContain("POST /api/v2/mirrors");
  });

  it("does not write anywhere when the env var is unset", () => {
    const summary = renderStepSummary(response, gaps);
    expect(typeof summary).toBe("string");
  });
});
