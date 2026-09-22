import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildGapsFile,
  computeGaps,
  computeOrphans,
  extractSpecCoverage,
  loadReport,
  matchesPattern,
} from "./collect-gaps";
import { assertCoverageReport, assertGapsFile } from "./types";
import type { CoverageReport } from "./types";

const FIXTURES = path.join(import.meta.dirname, "fixtures");
const SPEC_DIR = path.join(FIXTURES, "repo", "e2e", "docker-stack", "api");

const tmpFiles: string[] = [];
afterEach(() => {
  for (const file of tmpFiles.splice(0)) {
    fs.rmSync(file, { recursive: true, force: true });
  }
});

const fixtureReport = (): CoverageReport =>
  JSON.parse(
    fs.readFileSync(path.join(FIXTURES, "report.fixture.json"), "utf-8"),
  ) as CoverageReport;

describe("loadReport", () => {
  it("parses a valid report file", () => {
    const report = loadReport(path.join(FIXTURES, "report.fixture.json"));
    expect(report.summary.routesExercised).toBe(4);
    expect(Object.keys(report.routes)).toHaveLength(4);
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
    const routes = broken.routes as unknown as Record<
      string,
      Record<string, unknown>
    >;
    delete routes["POST /api/v2/mirrors"]?.totalHits;
    expect(() => {
      assertCoverageReport(broken);
    }).toThrow(/POST \/api\/v2\/mirrors.*totalHits/s);
  });

  it("rejects an unexercised entry with a missing id", () => {
    const broken = fixtureReport();
    broken.unexercised = [
      { backend: "v2", source: "msw" },
    ] as typeof broken.unexercised;
    expect(() => {
      assertCoverageReport(broken);
    }).toThrow(/report\.unexercised\[0\]\.id/);
  });

  it("rejects an unexercised entry with an invalid backend", () => {
    const broken = fixtureReport();
    broken.unexercised = [
      { id: "GET /api/v2/tags", backend: "invalid", source: "msw" },
    ] as unknown as typeof broken.unexercised;
    expect(() => {
      assertCoverageReport(broken);
    }).toThrow(/report\.unexercised\[0\]\.backend/);
  });
});

describe("extractSpecCoverage", () => {
  it("extracts literal and template-literal calls, warns on dynamic", () => {
    const { calls, warnings } = extractSpecCoverage(SPEC_DIR);
    const simplified = calls.map((c) => `${c.method} ${c.urlPattern}`).sort();

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

describe("extractSpecCoverage scan roots", () => {
  it("scans only the requested roots and ignores ui/ integration specs", () => {
    const mixedDir = path.join(FIXTURES, "repo-mixed", "e2e", "docker-stack");
    const { calls } = extractSpecCoverage(mixedDir, ["api", "helpers"]);
    const signatures = calls.map((c) => `${c.method} ${c.urlPattern}`).sort();

    expect(signatures).toContain("GET /api/v2/computers");
    expect(signatures).toContain("POST /api/v2/login");
    expect(signatures).not.toContain("GET /debarchive/v1beta1/mirrors");
  });
});

describe("matchesPattern", () => {
  it("matches identical patterns", () => {
    expect(matchesPattern("/api/v2/computers", "/api/v2/computers")).toBe(true);
  });

  it("matches a {param} segment against a concrete segment", () => {
    expect(
      matchesPattern("/api/v2/computers/42", "/api/v2/computers/{id}"),
    ).toBe(true);
  });

  it("does not let {param} cross segments", () => {
    expect(
      matchesPattern("/api/v2/computers/42/disks", "/api/v2/computers/{id}"),
    ).toBe(false);
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
    expect(gaps[0]?.routeId).toBe("POST /api/v2/mirrors");
    expect(gaps[0]?.rank).toBe(1);
    expect(gaps[0]?.contracts).toHaveLength(1);
    expect(gaps[1]?.routeId).toBe("GET /debarchive/v1beta1/mirrors/{mirrorId}");
    expect(gaps[1]?.rank).toBe(2);
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

describe("computeOrphans", () => {
  it("returns empty when every extracted call matches an exercised route", () => {
    const { calls } = extractSpecCoverage(SPEC_DIR);
    expect(computeOrphans(fixtureReport(), calls)).toHaveLength(0);
  });

  it("does not flag calls that cover declared-but-unexercised routes", () => {
    const report = fixtureReport();
    const reportWithUnexercised: CoverageReport = {
      ...report,
      unexercised: [
        ...report.unexercised,
        { id: "GET /api/v2/computers", backend: "v2", source: "msw" },
      ],
    };
    const { calls } = extractSpecCoverage(SPEC_DIR);
    expect(computeOrphans(reportWithUnexercised, calls)).toHaveLength(0);
  });

  it("returns calls that match no declared route", () => {
    const report = fixtureReport();
    const reportWithoutComputers: CoverageReport = {
      ...report,
      routes: Object.fromEntries(
        Object.entries(report.routes).filter(
          ([routeId]) => routeId !== "GET /api/v2/computers",
        ),
      ),
      unexercised: report.unexercised.filter(
        (entry) => entry.id !== "GET /api/v2/computers",
      ),
    };
    const { calls } = extractSpecCoverage(SPEC_DIR);
    const orphans = computeOrphans(reportWithoutComputers, calls);

    expect(orphans).toHaveLength(1);
    expect(orphans[0]?.method).toBe("GET");
    expect(orphans[0]?.urlPattern).toBe("/api/v2/computers");
    expect(orphans[0]?.rank).toBe(1);
  });

  it("ranks deterministically by method, file, then line", () => {
    const emptyReport: CoverageReport = { ...fixtureReport(), routes: {} };
    const orphans = computeOrphans(emptyReport, [
      { method: "POST", urlPattern: "/b", file: "b.spec.ts", line: 2 },
      { method: "GET", urlPattern: "/a", file: "a.spec.ts", line: 1 },
      { method: "POST", urlPattern: "/b", file: "b.spec.ts", line: 1 },
    ]);

    expect(orphans.map((o) => `${o.method} ${o.urlPattern} ${o.line}`)).toEqual(
      ["GET /a 1", "POST /b 1", "POST /b 2"],
    );
    expect(orphans.map((o) => o.rank)).toEqual([1, 2, 3]);
  });
});

describe("buildGapsFile", () => {
  it("includes orphans and stats", () => {
    const { calls } = extractSpecCoverage(SPEC_DIR);
    const gaps = computeGaps(fixtureReport(), calls);
    const orphans = computeOrphans(fixtureReport(), calls);
    const gapsFile = buildGapsFile(
      fixtureReport(),
      { calls, warnings: [] },
      gaps,
      orphans,
    );

    expect(gapsFile.stats.orphansFound).toBe(orphans.length);
    expect(gapsFile.orphans).toEqual(orphans);
    expect(() => {
      assertGapsFile(gapsFile);
    }).not.toThrow();
  });
});

describe("assertGapsFile", () => {
  it("accepts a well-formed gaps file", () => {
    const { calls } = extractSpecCoverage(SPEC_DIR);
    const gaps = computeGaps(fixtureReport(), calls);
    const orphans = computeOrphans(fixtureReport(), calls);
    const gapsFile = {
      generatedAt: new Date().toISOString(),
      stats: {
        routesExercised: 4,
        specCallsExtracted: calls.length,
        gapsFound: gaps.length,
        orphansFound: orphans.length,
      },
      gaps,
      orphans,
      unexercisedInfo: fixtureReport().unexercised,
      extractionWarnings: [],
    };
    expect(() => {
      assertGapsFile(gapsFile);
    }).not.toThrow();
  });
});

describe("collect-gaps CLI", () => {
  it("exits 0 and still writes gaps.json when orphans are present", () => {
    const outFile = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), "collect-gaps-cli-")),
      "gaps.json",
    );
    tmpFiles.push(path.dirname(outFile));

    const tsxBin = path.join(
      import.meta.dirname,
      "../../../../node_modules/.bin/tsx",
    );
    const script = path.join(import.meta.dirname, "collect-gaps.ts");
    const orphanSpecDir = path.join(FIXTURES, "repo-orphans", "e2e", "docker-stack");

    // The orphan warning is written to stderr and not captured in the
    // returned string, but the gaps.json file proves the CLI did not exit.
    execFileSync(tsxBin, [
      script,
      "--report",
      path.join(FIXTURES, "report.fixture.json"),
      "--spec-dir",
      orphanSpecDir,
      "--scan-roots",
      "api",
      "--out",
      outFile,
    ]);

    expect(fs.existsSync(outFile)).toBe(true);
    const gapsFile = JSON.parse(fs.readFileSync(outFile, "utf-8")) as {
      stats: { orphansFound: number };
      orphans: unknown[];
    };
    expect(gapsFile.stats.orphansFound).toBeGreaterThan(0);
    expect(gapsFile.orphans).toHaveLength(gapsFile.stats.orphansFound);
  });
});
