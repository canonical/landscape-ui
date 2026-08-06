import fs from "fs";
import os from "os";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ContractSource } from "../types";
import { createV1ActionSource } from "./v1-actions";

const HANDLER_FIXTURE = `
import { API_URL, API_URL_OLD } from "@/constants";
import { http, HttpResponse } from "msw";
import { isAction } from "./_helpers";

export default [
  http.get(API_URL_OLD, async ({ request }) => {
    if (!isAction(request, "GetFoo")) {
      return;
    }
    return HttpResponse.json([]);
  }),

  // generics between method name and call parenthesis
  http.post<never, never, readonly string[]>(API_URL_OLD, async ({ request }) => {
    if (!isAction(request, "CreateFoo")) {
      return;
    }
    return HttpResponse.json([]);
  }),

  // array dispatch form covering several actions in one handler
  http.get(API_URL_OLD, async ({ request }) => {
    if (!isAction(request, ["RebootBar", "ShutdownBar"])) {
      return;
    }
    return HttpResponse.json([]);
  }),

  // v2 handler in the same file — carries no v1 actions
  http.get(\`\${API_URL}foos/:id\`, async () => {
    return HttpResponse.json({});
  }),
];
`;

let tempDir: string;
let source: ContractSource;

beforeAll(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "v1-handlers-"));
  fs.writeFileSync(path.join(tempDir, "foo.ts"), HANDLER_FIXTURE);
  fs.writeFileSync(path.join(tempDir, "ignored.md"), "not a handler");
  source = createV1ActionSource(tempDir);
});

afterAll(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe("createV1ActionSource", () => {
  it("declares actions from both dispatch forms with their HTTP method", () => {
    const ids = source.listRoutes().map((route) => route.id);
    expect(ids).toContain("GET /api/?action=GetFoo");
    expect(ids).toContain("POST /api/?action=CreateFoo");
    expect(ids).toContain("GET /api/?action=RebootBar");
    expect(ids).toContain("GET /api/?action=ShutdownBar");
    expect(ids).toHaveLength(4);
  });

  it("matches v1 traffic by its action query parameter", () => {
    const matched = source.match(
      "GET",
      new URL("http://localhost:3000/api/?action=GetFoo&version=2011-08-01"),
    );
    expect(matched?.id).toBe("GET /api/?action=GetFoo");
    expect(matched?.backend).toBe("v1");
    expect(matched?.source).toBe("msw-actions");
  });

  it("claims undeclared actions but labels them observed-only", () => {
    const matched = source.match(
      "GET",
      new URL("http://localhost:3000/api/?action=UnknownAction"),
    );
    expect(matched?.id).toBe("GET /api/?action=UnknownAction");
    expect(matched?.source).toBe("observed-only");
  });

  it("ignores non-v1 traffic", () => {
    const base = "http://localhost:3000";
    expect(
      source.match("GET", new URL(`${base}/api/v2/foos?action=GetFoo`)),
    ).toBeNull();
    expect(source.match("GET", new URL(`${base}/api/`))).toBeNull();
  });
});
