import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";
import { createMockClient } from "./llm-client";
import { run } from "./run-eval-loop";
import type { SuggestionsResponse } from "./types";
import { assertGapsFile } from "./types";

const FIXTURES = path.join(import.meta.dirname, "fixtures");
const REPORT = path.join(FIXTURES, "report.fixture.json");
const SPEC_DIR = path.join(FIXTURES, "repo", "e2e", "docker-stack", "api");
const COVERED_SPEC_DIR = path.join(
  FIXTURES,
  "repo-covered",
  "e2e",
  "docker-stack",
  "api",
);
const EXEMPLAR = path.join(
  FIXTURES,
  "repo",
  "e2e",
  "docker-stack",
  "api",
  "widgets.spec.ts",
);

const tmpDirs: string[] = [];
const outDir = (): string => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "eval-loop-run-"));
  tmpDirs.push(dir);
  return dir;
};

afterEach(() => {
  for (const dir of tmpDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

const mockResponse: SuggestionsResponse = {
  suggestions: [
    {
      route: "POST /api/v2/mirrors",
      title: "Cover mirror creation",
      rationale: "Mutating route, highest hits.",
      spec: "// spec 1",
      notes: "",
    },
    {
      route: "GET /debarchive/v1beta1/mirrors/{mirrorId}",
      title: "Cover mirror fetch",
      rationale: "Go route, second highest hits.",
      spec: "// spec 2",
      notes: "",
    },
  ],
};

const options = (client = createMockClient(JSON.stringify(mockResponse))) => ({
  reportPath: REPORT,
  specDir: SPEC_DIR,
  outDir: outDir(),
  exemplarPath: EXEMPLAR,
  client,
});

describe("run", () => {
  it("happy path: writes gaps.json and one artifact per suggestion", async () => {
    const opts = options();
    const result = await run(opts);

    expect(result.status).toBe("ok");
    expect(result.gapsFound).toBe(2);
    expect(result.suggestionsWritten).toHaveLength(2);

    const gapsFile = JSON.parse(
      fs.readFileSync(path.join(opts.outDir, "gaps.json"), "utf-8"),
    ) as unknown;
    expect(() => {
      assertGapsFile(gapsFile);
    }).not.toThrow();

    for (const written of result.suggestionsWritten) {
      expect(fs.existsSync(written)).toBe(true);
      const content = fs.readFileSync(written, "utf-8");
      expect(content).toContain("## Proposed spec");
    }
  });

  it("zero gaps: exits early without calling the client", async () => {
    let called = false;
    const client = {
      complete: () => {
        called = true;
        return Promise.resolve({ text: "", model: "mock" });
      },
    };
    const result = await run({ ...options(client), specDir: COVERED_SPEC_DIR });

    expect(result.status).toBe("no-gaps");
    expect(result.gapsFound).toBe(0);
    expect(result.suggestionsWritten).toHaveLength(0);
    expect(called).toBe(false);
    expect(fs.existsSync(path.join(result.outDir, "suggestions"))).toBe(false);
  });

  it("LLM failure: gaps.json survives, error propagates", async () => {
    const failingClient = {
      complete: () =>
        Promise.reject(
          new Error("LLM request failed: HTTP 401 — Unauthorized"),
        ),
    };
    const opts = options(failingClient);

    await expect(run(opts)).rejects.toThrow(/401/);
    expect(fs.existsSync(path.join(opts.outDir, "gaps.json"))).toBe(true);
  });

  it("unparseable LLM output: writes raw fallback artifact, no suggestion files", async () => {
    const garbageClient = createMockClient("this is not JSON");
    const opts = options(garbageClient);
    const result = await run(opts);

    expect(result.status).toBe("llm-failure");
    expect(result.suggestionsWritten).toHaveLength(0);
    const fallback = path.join(
      opts.outDir,
      "suggestions",
      "00-raw-llm-output.md",
    );
    expect(fs.existsSync(fallback)).toBe(true);
    expect(fs.readFileSync(fallback, "utf-8")).toContain("this is not JSON");
    const suggestionFiles = fs
      .readdirSync(path.join(opts.outDir, "suggestions"))
      .filter((file) => /^\d{2}-.+\.md$/.test(file) && !file.startsWith("00-"));
    expect(suggestionFiles).toHaveLength(0);
  });
});
