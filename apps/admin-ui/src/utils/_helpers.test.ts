import { describe, expect, it } from "vitest";
import type { InternalAxiosRequestConfig } from "axios";

import { handleParams } from "./_helpers";
import { API_VERSION } from "@/constants";

const makeConfig = (
  options: Partial<InternalAxiosRequestConfig>,
): InternalAxiosRequestConfig => {
  return {
    baseURL: "https://api.example.com",
    url: "/",
    method: "get",
    headers: {},
    params: {},
    data: undefined,
    ...options,
  } as InternalAxiosRequestConfig;
};

describe("handleParams", () => {
  it("includes `action` and `version` when isOld === true", () => {
    const config = makeConfig({
      method: "get",
      url: "/users",
      params: { foo: "bar" },
    });

    const result = handleParams({ config, isOld: true });

    expect(result).toStrictEqual({
      action: "/users",
      version: API_VERSION,
      foo: "bar",
    });
  });

  it("omits `action` and `version` when isOld === false", () => {
    const config = makeConfig({
      method: "get",
      params: { foo: "bar" },
    });

    const result = handleParams({ config, isOld: false });
    expect(result).toStrictEqual({ foo: "bar" });
  });

  it("converts number & boolean to strings when isOld === true", () => {
    const config = makeConfig({
      method: "get",
      url: "/count",
      params: { count: 5, enabled: true },
    });

    const result = handleParams({ config, isOld: true });

    expect(result).toStrictEqual({
      action: "/count",
      version: API_VERSION,
      count: "5",
      enabled: "true",
    });
  });

  it("keeps number & boolean as primitives when isOld === false", () => {
    const config = makeConfig({
      method: "get",
      params: { count: 5, enabled: false },
    });

    const result = handleParams({ config, isOld: false });
    expect(result).toStrictEqual({ count: 5, enabled: false });
  });

  it("flattens array parameters in legacy (isOld) mode", () => {
    const config = makeConfig({
      method: "get",
      params: { tags: ["red", "blue"] },
    });

    const result = handleParams({ config, isOld: true });

    expect(result).toStrictEqual({
      action: "/",
      version: API_VERSION,
      "tags.1": "red",
      "tags.2": "blue",
    });
  });

  it("ignores empty arrays in legacy mode", () => {
    const config = makeConfig({
      method: "get",
      params: { tags: [] },
    });

    const result = handleParams({ config, isOld: true });
    expect(result).toStrictEqual({ action: "/", version: API_VERSION });
  });

  it("stringifies array parameters on GET requests when !isOld", () => {
    const config = makeConfig({
      method: "get",
      params: { tags: ["red", "blue"] },
    });

    const result = handleParams({ config, isOld: false });
    expect(result).toStrictEqual({ tags: "red,blue" });
  });

  it("passes arrays through untouched on POST/PUT/PATCH when !isOld", () => {
    ["post", "put", "patch"].forEach((method) => {
      const cfg = makeConfig({
        method: method as InternalAxiosRequestConfig["method"],
        data: { tags: ["red", "blue"] },
      });
      const res = handleParams({ config: cfg, isOld: false });
      expect(res).toStrictEqual({ tags: ["red", "blue"] });
    });
  });

  it("stringifies objects on GET requests regardless of isOld", () => {
    const obj = { key: "value" };
    const config = makeConfig({ method: "get", params: { filter: obj } });

    const asOld = handleParams({ config, isOld: true });
    const asNew = handleParams({ config, isOld: false });

    expect(asOld.filter).toBe(JSON.stringify(obj));
    expect(asNew.filter).toBe(JSON.stringify(obj));
  });

  it("retains objects as objects on POST when !isOld", () => {
    const payload = { key: "value" };
    const config = makeConfig({ method: "post", data: { filter: payload } });

    const result = handleParams({ config, isOld: false });
    expect(result.filter).toStrictEqual(payload);
  });

  it("stringifies objects on POST when isOld", () => {
    const payload = { key: "value" };
    const config = makeConfig({ method: "post", data: { filter: payload } });

    const result = handleParams({ config, isOld: true });
    expect(result.filter).toBe(JSON.stringify(payload));
  });

  it("ignores empty strings, undefined, or empty arrays", () => {
    const config = makeConfig({
      method: "get",
      params: {
        emptyStr: "",
        nil: undefined,
        emptyArr: [],
        valid: "yes",
      },
    });

    const result = handleParams({ config, isOld: false });
    expect(result).toStrictEqual({ valid: "yes" });
  });

  it("throws when encountering an unsupported type", () => {
    const config = makeConfig({
      method: "get",
      params: {
        func: () => "nope",
      },
    });

    expect(() => handleParams({ config, isOld: false })).toThrow(
      "Unsupported argument type",
    );
  });

  it("skips processing when params/data is undefined", () => {
    const cfg1 = makeConfig({ method: "get" });
    const cfg2 = makeConfig({ method: "post" });

    const res1 = handleParams({ config: cfg1, isOld: false });
    const res2 = handleParams({ config: cfg2, isOld: false });

    expect(res1).toStrictEqual({});
    expect(res2).toStrictEqual({});
  });
});
