import { describe, expect, it } from "vitest";
import type { OpenApiSpec } from "./openapi";
import { createOpenApiSource } from "./openapi";

const SPEC: OpenApiSpec = {
  paths: {
    "/v1beta1/mirrors": { get: {}, post: {} },
    "/v1beta1/mirrors/{mirror}": {
      get: { parameters: [{ name: "mirror", in: "path" }] },
    },
    "/v1beta1/mirrors/{mirror}:sync": {
      post: { parameters: [{ name: "mirror", in: "path" }] },
    },
    // Old gnostic wildcard style: param resolved via its schema pattern
    "/v1beta1/{name}": {
      get: {
        parameters: [
          { name: "name", in: "path", schema: { pattern: "locals/[^/]+" } },
        ],
      },
    },
    "/v1beta1/{operation}": {
      delete: {
        parameters: [
          {
            name: "operation",
            in: "path",
            schema: { pattern: "operations/.+" },
          },
        ],
      },
    },
  },
};

const source = createOpenApiSource("/debarchive", SPEC);

describe("createOpenApiSource", () => {
  it("declares routes mounted under the base path with go provenance", () => {
    const ids = source.listRoutes().map((route) => route.id);
    expect(ids).toContain("GET /debarchive/v1beta1/mirrors");
    expect(ids).toContain("POST /debarchive/v1beta1/mirrors");
    expect(ids).toContain("GET /debarchive/v1beta1/mirrors/{mirror}");
    expect(source.listRoutes().every((route) => route.backend === "go")).toBe(
      true,
    );
    expect(
      source.listRoutes().every((route) => route.source === "openapi"),
    ).toBe(true);
  });

  it("resolves wildcard params from their schema patterns", () => {
    const ids = source.listRoutes().map((route) => route.id);
    expect(ids).toContain("GET /debarchive/v1beta1/locals/{name}");
    expect(ids).toContain(
      "DELETE /debarchive/v1beta1/operations/{operation...}",
    );
  });

  it("matches concrete URLs to declared routes", () => {
    const base = "http://localhost:3000";
    expect(
      source.match("GET", new URL(`${base}/debarchive/v1beta1/mirrors`))?.id,
    ).toBe("GET /debarchive/v1beta1/mirrors");
    expect(
      source.match(
        "GET",
        new URL(`${base}/debarchive/v1beta1/mirrors/third-party-mirror`),
      )?.id,
    ).toBe("GET /debarchive/v1beta1/mirrors/{mirror}");
    expect(
      source.match(
        "POST",
        new URL(`${base}/debarchive/v1beta1/mirrors/my-mirror:sync`),
      )?.id,
    ).toBe("POST /debarchive/v1beta1/mirrors/{mirror}:sync");
    expect(
      source.match(
        "GET",
        new URL(`${base}/debarchive/v1beta1/locals/local-repo-1`),
      )?.id,
    ).toBe("GET /debarchive/v1beta1/locals/{name}");
  });

  it("matches multi-segment wildcard params across slashes", () => {
    expect(
      source.match(
        "DELETE",
        new URL(
          "http://localhost:3000/debarchive/v1beta1/operations/mirror-abc/123",
        ),
      )?.id,
    ).toBe("DELETE /debarchive/v1beta1/operations/{operation...}");
  });

  it("returns null for other methods, paths, and backends", () => {
    const base = "http://localhost:3000";
    expect(
      source.match("DELETE", new URL(`${base}/debarchive/v1beta1/mirrors`)),
    ).toBeNull();
    expect(source.match("GET", new URL(`${base}/api/v2/mirrors`))).toBeNull();
  });
});
