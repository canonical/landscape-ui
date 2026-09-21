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
const ORPHAN_SPEC_DIR = path.join(
  FIXTURES,
  "repo-orphans",
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
    expect(result.orphansFound).toBe(0);
    expect(result.suggestionsWritten).toHaveLength(0);
    expect(called).toBe(false);
    expect(fs.existsSync(path.join(result.outDir, "suggestions"))).toBe(false);
  });

  it("orphans: writes gaps.json but stops before calling the client", async () => {
    let called = false;
    const client = {
      complete: () => {
        called = true;
        return Promise.resolve({ text: "", model: "mock" });
      },
    };
    const opts = { ...options(client), specDir: ORPHAN_SPEC_DIR };
    const result = await run(opts);

    expect(result.status).toBe("orphans");
    expect(result.orphansFound).toBe(1);
    expect(result.suggestionsWritten).toHaveLength(0);
    expect(called).toBe(false);
    expect(fs.existsSync(path.join(result.outDir, "gaps.json"))).toBe(true);
    const gapsFile = JSON.parse(
      fs.readFileSync(path.join(result.outDir, "gaps.json"), "utf-8"),
    ) as unknown;
    expect(() => {
      assertGapsFile(gapsFile);
    }).not.toThrow();
    expect(
      (gapsFile as { orphans: { urlPattern: string }[] }).orphans,
    ).toHaveLength(1);
    expect(
      (gapsFile as { orphans: { urlPattern: string }[] }).orphans[0]
        ?.urlPattern,
    ).toBe("/api/v2/orphan-route");
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

  it("prompt too large: writes raw fallback artifact and returns llm-failure", async () => {
    const hugeExemplarPath = path.join(
      tmpDirs[tmpDirs.length - 1] ?? os.tmpdir(),
      "huge-exemplar.spec.ts",
    );
    const hugeExemplarLength = 12_000;
    fs.writeFileSync(hugeExemplarPath, "x".repeat(hugeExemplarLength), "utf-8");
    const opts = {
      ...options(),
      exemplarPath: hugeExemplarPath,
    };
    const result = await run(opts);

    expect(result.status).toBe("llm-failure");
    expect(result.suggestionsWritten).toHaveLength(0);
    expect(result.rawFallbackPath).toBeDefined();
    expect(fs.existsSync(result.rawFallbackPath ?? "")).toBe(true);
    expect(fs.existsSync(path.join(opts.outDir, "gaps.json"))).toBe(true);
    const fallbackContent = fs.readFileSync(
      result.rawFallbackPath ?? "",
      "utf-8",
    );
    expect(fallbackContent).toContain("prompt too large");
  });

  it("LLM_MOCK=1 succeeds by deriving suggestions from the computed gaps", async () => {
    const opts = {
      ...options(),
      client: undefined,
      mockFromGaps: true,
    };
    const result = await run(opts);

    expect(result.status).toBe("ok");
    expect(result.suggestionsWritten).toHaveLength(2);
    expect(fs.existsSync(path.join(opts.outDir, "gaps.json"))).toBe(true);
  });

  it("rejects an empty suggestions array", async () => {
    const emptyClient = createMockClient('{"suggestions":[]}');
    const opts = options(emptyClient);
    const result = await run(opts);

    expect(result.status).toBe("llm-failure");
    expect(result.suggestionsWritten).toHaveLength(0);
  });

  it("rejects a partial subset of prompted routes", async () => {
    const partialResponse = {
      suggestions: mockResponse.suggestions.slice(0, 1),
    };
    const partialClient = createMockClient(JSON.stringify(partialResponse));
    const opts = options(partialClient);
    const result = await run(opts);

    expect(result.status).toBe("llm-failure");
    expect(result.suggestionsWritten).toHaveLength(0);
  });

  it("rejects a duplicated route that replaces a distinct prompted route", async () => {
    const [duplicateRoute] = mockResponse.suggestions;
    const duplicateResponse = {
      suggestions: [duplicateRoute, duplicateRoute],
    };
    const duplicateClient = createMockClient(JSON.stringify(duplicateResponse));
    const opts = options(duplicateClient);
    const result = await run(opts);

    expect(result.status).toBe("llm-failure");
    expect(result.suggestionsWritten).toHaveLength(0);
  });

  it("rejects suggestions that include an extra route", async () => {
    const extraResponse = {
      suggestions: [
        ...mockResponse.suggestions,
        {
          route: "GET /api/v2/extra",
          title: "Extra",
          rationale: "Not in prompt.",
          spec: "// spec",
          notes: "",
        },
      ],
    };
    const extraClient = createMockClient(JSON.stringify(extraResponse));
    const opts = options(extraClient);
    const result = await run(opts);

    expect(result.status).toBe("llm-failure");
    expect(result.suggestionsWritten).toHaveLength(0);
  });
});
