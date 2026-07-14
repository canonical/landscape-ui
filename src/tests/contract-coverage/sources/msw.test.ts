import fs from "fs";
import os from "os";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ContractSource } from "../types";
import { createMswHandlerSource } from "./msw";

const MANIFEST = [
  { method: "GET", path: "/api/v2/administrators", isRegExpPath: false },
  { method: "PUT", path: "/api/v2/administrators/:id", isRegExpPath: false },
  {
    method: "POST",
    path: "/debarchive/v1beta1/mirrors/:mirrorId\\:sync",
    isRegExpPath: false,
  },
  // v1 catch-alls must be skipped (identity is the action param, not the path)
  { method: "GET", path: "/api/", isRegExpPath: false },
  { method: "POST", path: "/api/", isRegExpPath: false },
  // regexp paths cannot be canonicalized and must be skipped
  { method: "GET", path: "/\\/api\\/v2\\/.*/", isRegExpPath: true },
  // duplicate declarations collapse to one route
  { method: "GET", path: "/api/v2/administrators", isRegExpPath: false },
];

let tempDir: string;
let source: ContractSource;

beforeAll(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "msw-manifest-"));
  const manifestPath = path.join(tempDir, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(MANIFEST));
  source = createMswHandlerSource(manifestPath);
});

afterAll(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe("createMswHandlerSource", () => {
  it("declares canonicalized routes with backend classification", () => {
    const routes = source.listRoutes();
    const byId = new Map(routes.map((route) => [route.id, route]));

    expect(byId.get("GET /api/v2/administrators")?.backend).toBe("v2");
    expect(byId.get("PUT /api/v2/administrators/{id}")?.backend).toBe("v2");
    expect(
      byId.get("POST /debarchive/v1beta1/mirrors/{mirrorId}:sync")?.backend,
    ).toBe("go");
    expect(
      routes.every((route) => route.source === "msw-handlers"),
    ).toBe(true);
  });

  it("skips v1 catch-alls, regexp paths, and duplicates", () => {
    const ids = source.listRoutes().map((route) => route.id);
    expect(ids).toHaveLength(3);
    expect(ids.filter((id) => id.endsWith(" /api"))).toHaveLength(0);
  });

  it("matches concrete URLs, tolerating trailing slashes", () => {
    const base = "http://localhost:3000";
    expect(
      source.match("PUT", new URL(`${base}/api/v2/administrators/7`))?.id,
    ).toBe("PUT /api/v2/administrators/{id}");
    expect(
      source.match("GET", new URL(`${base}/api/v2/administrators/`))?.id,
    ).toBe("GET /api/v2/administrators");
    expect(
      source.match(
        "POST",
        new URL(`${base}/debarchive/v1beta1/mirrors/my-mirror:sync`),
      )?.id,
    ).toBe("POST /debarchive/v1beta1/mirrors/{mirrorId}:sync");
  });

  it("returns null for undeclared traffic", () => {
    expect(
      source.match(
        "DELETE",
        new URL("http://localhost:3000/api/v2/administrators/7"),
      ),
    ).toBeNull();
  });
});
