import { describe, expect, it } from "vitest";
import { createHeuristicSource } from "./heuristic";

const source = createHeuristicSource();

const match = (method: string, url: string) =>
  source.match(method, new URL(url));

describe("createHeuristicSource", () => {
  it("declares no route universe of its own", () => {
    expect(source.listRoutes()).toHaveLength(0);
  });

  it("labels everything it emits as a guess", () => {
    expect(
      match("GET", "http://localhost:3000/api/v2/whatever")?.source,
    ).toBe("heuristic");
  });

  it("collapses UUID and numeric segments to {id}", () => {
    expect(
      match(
        "GET",
        "http://localhost:3000/api/v2/things/7b1d5c2f-0c4e-4d8e-8f2f-99d4f2d9a123",
      )?.pattern,
    ).toBe("/api/v2/things/{id}");
    expect(
      match("GET", "http://localhost:3000/api/v2/invitations/1/summary")
        ?.pattern,
    ).toBe("/api/v2/invitations/{id}/summary");
  });

  it("keeps static hyphenated segments literal", () => {
    expect(
      match("GET", "http://localhost:3000/api/v2/auth/supported-providers")
        ?.pattern,
    ).toBe("/api/v2/auth/supported-providers");
  });

  it("preserves custom verb suffixes without double slashes", () => {
    expect(
      match(
        "POST",
        "http://localhost:3000/debarchive/v1beta1/publications/7b1d5c2f-0c4e-4d8e-8f2f-99d4f2d9a123:publish",
      )?.pattern,
    ).toBe("/debarchive/v1beta1/publications/{id}:publish");
  });

  it("classifies the backend and strips query and trailing slash", () => {
    const matched = match(
      "GET",
      "http://localhost:3000/debarchive/v1beta1/mirrors/?pageSize=10",
    );
    expect(matched?.backend).toBe("go");
    expect(matched?.pattern).toBe("/debarchive/v1beta1/mirrors");
  });
});
