import { describe, expect, it } from "vitest";
import pageParamsManager from "./pageParamsManager";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_DAYS,
  DEFAULT_EMPTY_ARRAY,
  DEFAULT_EMPTY_STRING,
  DEFAULT_PAGE_SIZE,
} from "./constants";

describe("PageParamsManager (Refactored)", () => {
  describe("shouldResetPage", () => {
    it("returns true if at least one 'shouldResetPage' param is in newParams", () => {
      expect(pageParamsManager.shouldResetPage({ days: DEFAULT_DAYS })).toBe(
        true,
      );
      expect(pageParamsManager.shouldResetPage({ type: "someType" })).toBe(
        true,
      );
    });

    it("returns false if none of the 'shouldResetPage' params are in newParams", () => {
      expect(pageParamsManager.shouldResetPage({ currentPage: 3 })).toBe(false);
    });

    it("returns false if newParams is empty", () => {
      expect(pageParamsManager.shouldResetPage({})).toBe(false);
    });
  });

  describe("sanitizeSearchParams", () => {
    it("removes invalid date fromDate/toDate", () => {
      const params = new URLSearchParams({
        fromDate: "not-a-valid-date",
        toDate: "invalid-date",
      });
      const sanitized = pageParamsManager.sanitizeSearchParams(params);
      expect(sanitized.has("fromDate")).toBe(false);
      expect(sanitized.has("toDate")).toBe(false);
    });

    it("keeps valid date fromDate/toDate", () => {
      const params = new URLSearchParams({
        fromDate: "2023-01-01T00:00:00Z",
        toDate: "2023-12-31T23:59:59Z",
      });
      const sanitized = pageParamsManager.sanitizeSearchParams(params);
      expect(sanitized.get("fromDate")).toBe("2023-01-01T00:00:00Z");
      expect(sanitized.get("toDate")).toBe("2023-12-31T23:59:59Z");
    });

    it("removes param if it matches its default (e.g. pageSize, days)", () => {
      const params = new URLSearchParams({
        pageSize: DEFAULT_PAGE_SIZE.toString(),
        days: DEFAULT_DAYS,
      });
      const sanitized = pageParamsManager.sanitizeSearchParams(params);
      expect(sanitized.has("pageSize")).toBe(false);
      expect(sanitized.has("days")).toBe(false);
    });

    it("removes param if it's not in dynamic allowed values", () => {
      pageParamsManager.setDynamicAllowedValues("os", ["linux", "windows"]);
      const params = new URLSearchParams({ os: "mac" });
      const sanitized = pageParamsManager.sanitizeSearchParams(params);
      expect(sanitized.has("os")).toBe(false);
    });

    it("keeps param if it is in dynamic allowed values", () => {
      pageParamsManager.setDynamicAllowedValues("os", ["linux", "windows"]);
      const params = new URLSearchParams({ os: "linux" });
      const sanitized = pageParamsManager.sanitizeSearchParams(params);
      expect(sanitized.get("os")).toBe("linux");
    });

    it("removes array param if any item is disallowed", () => {
      pageParamsManager.setDynamicAllowedValues("tags", ["tagA", "tagB"]);
      const params = new URLSearchParams({ tags: "tagA,invalidTag" });
      const sanitized = pageParamsManager.sanitizeSearchParams(params);
      expect(sanitized.has("tags")).toBe(false);
    });

    it("keeps array param if all items are allowed", () => {
      pageParamsManager.setDynamicAllowedValues("tags", ["tagA", "tagB"]);
      const params = new URLSearchParams({ tags: "tagA,tagB" });
      const sanitized = pageParamsManager.sanitizeSearchParams(params);
      expect(sanitized.get("tags")).toBe("tagA,tagB");
    });
  });

  describe("getParsedParams", () => {
    it("applies default values when param is absent", () => {
      const params = new URLSearchParams(); // empty
      const parsed = pageParamsManager.getParsedParams(params);

      expect(parsed.currentPage).toBe(DEFAULT_CURRENT_PAGE);
      expect(parsed.pageSize).toBe(DEFAULT_PAGE_SIZE);
      expect(parsed.days).toBe(DEFAULT_DAYS);
      expect(parsed.search).toBe(DEFAULT_EMPTY_STRING);
      expect(parsed.disabledColumns).toEqual(DEFAULT_EMPTY_ARRAY);
    });

    it("splits comma-separated array fields", () => {
      const params = new URLSearchParams({
        accessGroups: "groupA,groupB",
        tags: "tag1,tag2",
      });
      const parsed = pageParamsManager.getParsedParams(params);
      expect(parsed.accessGroups).toEqual(["groupA", "groupB"]);
      expect(parsed.tags).toEqual(["tag1", "tag2"]);
    });

    it("parses numeric fields as numbers", () => {
      const params = new URLSearchParams({
        currentPage: "10",
        pageSize: "99",
      });
      const parsed = pageParamsManager.getParsedParams(params);
      expect(parsed.currentPage).toBe(10);
      expect(parsed.pageSize).toBe(99);
    });

    it("falls back to default if numeric parse fails", () => {
      const params = new URLSearchParams({
        pageSize: "not-a-number",
      });
      const parsed = pageParamsManager.getParsedParams(params);
      expect(parsed.pageSize).toBe(DEFAULT_PAGE_SIZE);
    });

    it("treats defaultValue === null as a 'free form' string param", () => {
      // e.g. "sort" has defaultValue = null
      const params = new URLSearchParams({ sort: "asc" });
      const parsed = pageParamsManager.getParsedParams(params);
      expect(parsed.sort).toBe("asc");
    });
  });

  describe("setDynamicAllowedValues", () => {
    it("properly sets dynamic values and affects sanitization", () => {
      pageParamsManager.setDynamicAllowedValues("type", ["type1", "type2"]);
      const validParams = new URLSearchParams({ type: "type1" });
      const invalidParams = new URLSearchParams({ type: "invalid" });

      const sanitizedValid =
        pageParamsManager.sanitizeSearchParams(validParams);
      const sanitizedInvalid =
        pageParamsManager.sanitizeSearchParams(invalidParams);

      expect(sanitizedValid.get("type")).toBe("type1");
      expect(sanitizedInvalid.has("type")).toBe(false);
    });
  });

  describe("getCurrentPageParam", () => {
    it("returns the urlParam for current page", () => {
      expect(pageParamsManager.getCurrentPageParam()).toBe("currentPage");
    });
  });
});
