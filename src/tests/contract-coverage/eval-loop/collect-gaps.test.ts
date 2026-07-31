import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  computeGaps,
  extractSpecCoverage,
  loadReport,
  matchesPattern,
} from "./collect-gaps";
import { assertCoverageReport, assertGapsFile } from "./types";
import type { CoverageReport } from "./types";

const FIXTURES = path.join(import.meta.dirname, "fixtures");
const SPEC_DIR = path.join(FIXTURES, "spec-dir");

const fixtureReport = (): CoverageReport =>
  JSON.parse(
    fs.readFileSync(path.join(FIXTURES, "report.fixture.json"), "utf-8"),
  ) as CoverageReport;

describe("loadReport", () => {
  it("parses a valid report file", () => {
    const report = loadReport(path.join(FIXTURES, "report.fixture.json"));
    expect(report.summary.routesExercised).toBe(3);
    expect(Object.keys(report.routes)).toHaveLength(3);
  });

  it("throws with guidance when the file is missing", () => {
    expect(() => loadReport(path.join(FIXTURES, "nope.json"))).toThrow(
      /nope\.json.*run pnpm coverage:full first/s,
    );
  });

  it("throws 'malformed' on truncated JSON", () => {
    expect(() =>
      loadReport(path.join(FIXTURES, "malformed-report.json")),
    ).toThrow(/malformed/i);
  });
});

describe("assertCoverageReport", () => {
  it("accepts the fixture report", () => {
    expect(() => {
      assertCoverageReport(fixtureReport());
    }).not.toThrow();
  });

  it("rejects a report missing summary with the field path", () => {
    const broken = { ...fixtureReport() } as Record<string, unknown>;
    delete broken.summary;
    expect(() => {
      assertCoverageReport(broken);
    }).toThrow(/summary/);
  });

  it("rejects a route entry missing totalHits with the route id", () => {
    const broken = fixtureReport();
    const routes = broken.routes as Record<string, Record<string, unknown>>;
    delete routes["POST /api/v2/mirrors"].totalHits;
    expect(() => {
      assertCoverageReport(broken);
    }).toThrow(/POST \/api\/v2\/mirrors.*totalHits/s);
  });
});

describe("extractSpecCoverage", () => {
  it("extracts literal and template-literal calls, warns on dynamic", () => {
    const { calls, warnings } = extractSpecCoverage(SPEC_DIR);
    const simplified = calls
      .map((c) => `${c.method} ${c.urlPattern}`)
      .sort();

    expect(simplified).toEqual([
      "GET /api/v2/computers",
      "GET /api/v2/computers/{param}",
    ]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatch(/widgets\.spec\.ts/);
  });

  it("records file and line for provenance", () => {
    const { calls } = extractSpecCoverage(SPEC_DIR);
    for (const call of calls) {
      expect(call.file).toMatch(/widgets\.spec\.ts$/);
      expect(call.line).toBeGreaterThan(0);
    }
  });
});

describe("matchesPattern", () => {
  it("matches identical patterns", () => {
    expect(matchesPattern("/api/v2/computers", "/api/v2/computers")).toBe(
      true,
    );
  });

  it("matches a {param} segment against a concrete segment", () => {
    expect(
      matchesPattern("/api/v2/computers/42", "/api/v2/computers/{id}"),
    ).toBe(true);
  });

  it("does not let {param} cross segments", () => {
    expect(matchesPattern("/api/v2/computers/42/disks", "/api/v2/computers/{id}")).toBe(
      false,
    );
  });

  it("matches proxy-relative go URLs against the /debarchive mount", () => {
    expect(
      matchesPattern("/v1beta1/locals", "/debarchive/v1beta1/locals"),
    ).toBe(true);
  });
});

describe("computeGaps", () => {
  it("returns uncovered exercised routes ranked by hits with mutating first", () => {
    const { calls } = extractSpecCoverage(SPEC_DIR);
    const gaps = computeGaps(fixtureReport(), calls);

    expect(gaps).toHaveLength(2);
    expect(gaps[0].routeId).toBe("POST /api/v2/mirrors");
    expect(gaps[0].rank).toBe(1);
    expect(gaps[0].contracts).toHaveLength(1);
    expect(gaps[1].routeId).toBe("GET /debarchive/v1beta1/mirrors/{mirrorId}");
    expect(gaps[1].rank).toBe(2);
  });

  it("marks fully covered suites as gap-free", () => {
    const report = fixtureReport();
    const coverage = Object.values(report.routes).map((route) => ({
      method: route.method,
      urlPattern: route.pattern,
      file: "synthetic.spec.ts",
      line: 1,
    }));
    expect(computeGaps(report, coverage)).toHaveLength(0);
  });
});

describe("assertGapsFile", () => {
  it("accepts a well-formed gaps file", () => {
    const { calls } = extractSpecCoverage(SPEC_DIR);
    const gaps = computeGaps(fixtureReport(), calls);
    const gapsFile = {
      generatedAt: new Date().toISOString(),
      stats: {
        routesExercised: 3,
        specCallsExtracted: calls.length,
        gapsFound: gaps.length,
      },
      gaps,
      unexercisedInfo: fixtureReport().unexercised,
      extractionWarnings: [],
    };
    expect(() => {
      assertGapsFile(gapsFile);
    }).not.toThrow();
  });
});
