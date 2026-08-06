import { describe, expect, it } from "vitest";
import {
  canonicalizeMswPath,
  classifyBackend,
  patternToRegExp,
  structuralSignature,
} from "./matcher";

describe("classifyBackend", () => {
  it("classifies the three API generations by prefix", () => {
    expect(classifyBackend("/debarchive/v1beta1/mirrors")).toBe("go");
    expect(classifyBackend("/api/v2/administrators")).toBe("v2");
    expect(classifyBackend("/api/")).toBe("v1");
    expect(classifyBackend("/something-else")).toBe("unknown");
  });

  it("matches exact prefixes without trailing path", () => {
    expect(classifyBackend("/api/v2")).toBe("v2");
    expect(classifyBackend("/api")).toBe("v1");
  });

  it("does not classify v2 traffic as v1 despite the shared /api prefix", () => {
    expect(classifyBackend("/api/v2/users")).not.toBe("v1");
  });
});

describe("canonicalizeMswPath", () => {
  it("converts :param segments to {param}", () => {
    expect(canonicalizeMswPath("/api/v2/users/:userId")).toBe(
      "/api/v2/users/{userId}",
    );
    expect(
      canonicalizeMswPath("/api/v2/employees/:id/computers/:computerId"),
    ).toBe("/api/v2/employees/{id}/computers/{computerId}");
  });

  it("keeps unescaped mid-segment colons literal (custom verbs)", () => {
    expect(canonicalizeMswPath("/debarchive/v1beta1/mirrors:batchGet")).toBe(
      "/debarchive/v1beta1/mirrors:batchGet",
    );
  });

  it("converts escaped colons to literal verb suffixes after params", () => {
    expect(
      canonicalizeMswPath("/debarchive/v1beta1/mirrors/:mirrorId\\:sync"),
    ).toBe("/debarchive/v1beta1/mirrors/{mirrorId}:sync");
    expect(canonicalizeMswPath("/api/v2/computers\\:delete")).toBe(
      "/api/v2/computers:delete",
    );
  });

  it("leaves static paths untouched", () => {
    expect(canonicalizeMswPath("/api/v2/auth/supported-providers")).toBe(
      "/api/v2/auth/supported-providers",
    );
  });
});

describe("patternToRegExp", () => {
  it("matches single-segment params", () => {
    const regExp = patternToRegExp("/api/v2/users/{userId}");
    expect(regExp.test("/api/v2/users/42")).toBe(true);
    expect(regExp.test("/api/v2/users/john-doe")).toBe(true);
    expect(regExp.test("/api/v2/users/42/roles")).toBe(false);
    expect(regExp.test("/api/v2/users")).toBe(false);
  });

  it("does not let params swallow custom verb suffixes", () => {
    const regExp = patternToRegExp("/v1beta1/mirrors/{mirror}:sync");
    expect(regExp.test("/v1beta1/mirrors/my-mirror:sync")).toBe(true);
    expect(regExp.test("/v1beta1/mirrors/my-mirror")).toBe(false);
    expect(
      patternToRegExp("/v1beta1/mirrors/{mirror}").test(
        "/v1beta1/mirrors/my-mirror:sync",
      ),
    ).toBe(false);
  });

  it("matches multi-segment {param...} across slashes", () => {
    const regExp = patternToRegExp("/v1beta1/{operation...}");
    expect(regExp.test("/v1beta1/operations/mirror-abc/123")).toBe(true);
    expect(regExp.test("/v1beta1/operations/mirror-abc:cancel")).toBe(false);
  });

  it("treats regex metacharacters in literals literally", () => {
    const regExp = patternToRegExp("/api/?action=GetFoo");
    expect(regExp.test("/api/?action=GetFoo")).toBe(true);
    expect(regExp.test("/apiXaction=GetFoo")).toBe(false);
  });
});

describe("structuralSignature", () => {
  it("equates patterns that differ only in param names", () => {
    expect(structuralSignature("GET", "/v1beta1/mirrors/{mirrorId}")).toBe(
      structuralSignature("GET", "/v1beta1/mirrors/{name_1}"),
    );
  });

  it("distinguishes methods and verbs", () => {
    expect(structuralSignature("GET", "/v1beta1/mirrors/{m}")).not.toBe(
      structuralSignature("DELETE", "/v1beta1/mirrors/{m}"),
    );
    expect(structuralSignature("POST", "/v1beta1/mirrors/{m}:sync")).not.toBe(
      structuralSignature("POST", "/v1beta1/mirrors/{m}"),
    );
  });

  it("distinguishes single-segment from multi-segment params", () => {
    expect(structuralSignature("GET", "/v1beta1/{name}")).not.toBe(
      structuralSignature("GET", "/v1beta1/{name...}"),
    );
  });
});
