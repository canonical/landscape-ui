import { describe, expect, afterEach, it } from "vitest";
import {
  getEndpointStatus,
  normalizeEndpointPath,
  setEndpointStatus,
} from "./controller";
import { shouldApplyEndpointStatus } from "../server/handlers/_helpers";

describe("controller", () => {
  afterEach(() => {
    setEndpointStatus("default");
  });

  it("matches targeted statuses by exact endpoint path", () => {
    setEndpointStatus({ status: "error", path: "mirrors" });

    expect(getEndpointStatus("mirrors").status).toBe("error");
    expect(getEndpointStatus("mirrors/packages").status).toBe("default");
    expect(shouldApplyEndpointStatus("mirrors")).toBe(true);
    expect(shouldApplyEndpointStatus("mirrors/packages")).toBe(false);
  });

  it("returns the global fallback when multiple targeted statuses are configured", () => {
    setEndpointStatus([
      { status: "variant", path: "auth/handle-code", response: { ok: true } },
      {
        status: "variant",
        path: "standalone-account",
        response: { exists: false },
      },
    ]);

    expect(getEndpointStatus().status).toBe("default");
    expect(getEndpointStatus("auth/handle-code").status).toBe("variant");
    expect(getEndpointStatus("standalone-account").status).toBe("variant");
  });

  it("returns a single targeted status for legacy no-path callers", () => {
    setEndpointStatus({ status: "error", path: "logout" });

    expect(getEndpointStatus().status).toBe("error");
    expect(shouldApplyEndpointStatus()).toBe(false);
  });

  it("normalizes endpoint paths before matching", () => {
    expect(normalizeEndpointPath("/mirrors/")).toBe("mirrors");
    expect(normalizeEndpointPath(undefined)).toBe("");
  });
});
