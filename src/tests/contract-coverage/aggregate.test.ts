import { describe, expect, it } from "vitest";
import { buildReport } from "./aggregate";
import type { MigrationMapEntry } from "./migration-map";
import type {
  ContractSource,
  Observation,
  RouteDefinition,
} from "./types";

const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;
const HTTP_SERVER_ERROR = 500;

const route = (
  id: string,
  source: string,
  backend: RouteDefinition["backend"] = "go",
): RouteDefinition => {
  const [method = "", pattern = ""] = [
    id.slice(0, id.indexOf(" ")),
    id.slice(id.indexOf(" ") + 1),
  ];
  return { id, method, pattern, backend, source };
};

/** A stub connector declaring fixed routes and matching by exact pathname. */
const stubSource = (
  name: string,
  routes: RouteDefinition[],
  matcher?: (method: string, url: URL) => RouteDefinition | null,
): ContractSource => ({
  name,
  listRoutes: () => routes,
  match: (method, url) =>
    matcher?.(method, url) ??
    routes.find(
      (candidate) =>
        candidate.method === method &&
        candidate.pattern === url.pathname,
    ) ??
    null,
});

const observation = (
  method: string,
  url: string,
  status = HTTP_OK,
  requestPayload: unknown = null,
  responsePayload: unknown = null,
): Observation => ({
  method,
  url: `http://localhost:3000${url}`,
  status,
  requestPayload,
  responsePayload,
});

describe("buildReport", () => {
  it("counts hits and statuses per resolved route", () => {
    const source = stubSource("s", [route("GET /v1/things", "openapi")]);
    const report = buildReport(
      [
        observation("GET", "/v1/things"),
        observation("GET", "/v1/things"),
        observation("GET", "/v1/things", HTTP_SERVER_ERROR),
      ],
      [source],
      [],
    );

    const metric = report.routes["GET /v1/things"];
    expect(metric?.totalHits).toBe(3);
    expect(metric?.statuses).toEqual({
      [HTTP_OK]: 2,
      [HTTP_SERVER_ERROR]: 1,
    });
    expect(report.summary.routesExercised).toBe(1);
  });

  it("dedupes structurally equal routes across sources, priority wins", () => {
    const openapi = stubSource("openapi", [
      route("GET /v1/mirrors/{mirror}", "openapi"),
    ]);
    // Same shape, different param name, lower priority — and its match()
    // claims the traffic to prove remapping onto the canonical id.
    const mswRoute = route("GET /v1/mirrors/{mirrorId}", "msw-handlers");
    const msw = stubSource("msw", [mswRoute], (method, url) =>
      method === "GET" && url.pathname.startsWith("/v1/mirrors/")
        ? mswRoute
        : null,
    );

    const report = buildReport(
      [observation("GET", "/v1/mirrors/abc")],
      [openapi, msw],
      [],
    );

    expect(report.summary.routesDeclared).toBe(1);
    expect(report.routes["GET /v1/mirrors/{mirror}"]?.totalHits).toBe(1);
    expect(report.routes["GET /v1/mirrors/{mirrorId}"]).toBeUndefined();
    expect(report.unexercised).toHaveLength(0);
  });

  it("collects contract examples for mutations, deduped by payload shape", () => {
    const source = stubSource("s", [route("POST /v1/things", "openapi")]);
    const report = buildReport(
      [
        observation("POST", "/v1/things", HTTP_OK, { a: 1 }, { ok: true }),
        observation("POST", "/v1/things", HTTP_OK, { a: 1 }, { ok: true }),
        observation(
          "POST",
          "/v1/things",
          HTTP_BAD_REQUEST,
          { a: 1 },
          { error: "bad" },
        ),
      ],
      [source],
      [],
    );

    const contracts = report.routes["POST /v1/things"]?.contracts;
    expect(contracts).toHaveLength(2);
    expect(contracts?.map((contract) => contract.status)).toEqual([
      HTTP_OK,
      HTTP_BAD_REQUEST,
    ]);
    // Tracking hashes are stripped from the persisted report
    expect(
      contracts?.every(
        (contract) =>
          !("requestHash" in contract) && !("responseHash" in contract),
      ),
    ).toBe(true);
    // GET routes carry no contracts at all
    const getReport = buildReport(
      [observation("GET", "/v1/things")],
      [stubSource("s", [route("GET /v1/things", "openapi")])],
      [],
    );
    expect(getReport.routes["GET /v1/things"]?.contracts).toBeUndefined();
  });

  it("reports declared routes with zero traffic as unexercised", () => {
    const source = stubSource("s", [
      route("GET /v1/hit", "openapi"),
      route("GET /v1/missed", "openapi"),
    ]);
    const report = buildReport([observation("GET", "/v1/hit")], [source], []);

    expect(report.unexercised).toEqual([
      { id: "GET /v1/missed", backend: "go", source: "openapi" },
    ]);
  });

  it("reports heuristic and observed-only matches as drift", () => {
    const heuristicRoute = route("GET /v1/mystery", "heuristic", "unknown");
    const source = stubSource("h", [], () => heuristicRoute);
    const report = buildReport(
      [observation("GET", "/v1/mystery")],
      [source],
      [],
    );

    expect(report.drift).toEqual([
      {
        id: "GET /v1/mystery",
        backend: "unknown",
        source: "heuristic",
        totalHits: 1,
      },
    ]);
  });

  it("reports migration status per layer and warns on unknown ids", () => {
    const source = stubSource("s", [
      route("GET /api/?action=GetFoo", "msw-actions", "v1"),
      route("GET /v1/foos", "openapi"),
    ]);
    const map: MigrationMapEntry[] = [
      {
        name: "Foo — list",
        v1: "GET /api/?action=GetFoo",
        go: "GET /v1/foos",
      },
      { name: "Broken entry", v2: "GET /api/v2/typo" },
    ];
    const report = buildReport(
      [observation("GET", "/v1/foos")],
      [source],
      map,
    );

    const [foo, broken] = report.migration;
    expect(foo?.layers.v1).toEqual({
      routeId: "GET /api/?action=GetFoo",
      declared: true,
      totalHits: 0,
    });
    expect(foo?.layers.go?.totalHits).toBe(1);
    expect(broken?.layers.v2?.declared).toBe(false);
    expect(report.warnings).toHaveLength(1);
    expect(report.warnings[0]).toContain("Broken entry");
    expect(report.warnings[0]).toContain("GET /api/v2/typo");
  });

  it("summarizes declared and exercised counts per backend", () => {
    const source = stubSource("s", [
      route("GET /api/?action=GetFoo", "msw-actions", "v1"),
      route("GET /v1/foos", "openapi"),
    ]);
    const report = buildReport(
      [observation("GET", "/v1/foos")],
      [source],
      [],
    );

    expect(report.summary.byBackend.v1).toEqual({
      declared: 1,
      exercised: 0,
    });
    expect(report.summary.byBackend.go).toEqual({
      declared: 1,
      exercised: 1,
    });
  });
});
