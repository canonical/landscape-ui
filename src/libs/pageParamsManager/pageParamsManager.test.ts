import { afterEach, describe, expect, it } from "vitest";
import pageParamsManager from "./pageParamsManager";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_DAYS,
  DEFAULT_EMPTY_ARRAY,
  DEFAULT_EMPTY_STRING,
  DEFAULT_PAGE_SIZE,
} from "./constants";

describe("PageParamsManager (Refactored)", () => {
  afterEach(() => {
    pageParamsManager.clearAllDynamicAllowedValues();
  });

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
      pageParamsManager.registerDynamicAllowedValues("os", [
        "linux",
        "windows",
      ]);
      const params = new URLSearchParams({ os: "mac" });
      const sanitized = pageParamsManager.sanitizeSearchParams(params);
      expect(sanitized.has("os")).toBe(false);
    });

    it("keeps param if it is in dynamic allowed values", () => {
      pageParamsManager.registerDynamicAllowedValues("os", [
        "linux",
        "windows",
      ]);
      const params = new URLSearchParams({ os: "linux" });
      const sanitized = pageParamsManager.sanitizeSearchParams(params);
      expect(sanitized.get("os")).toBe("linux");
    });

    it("removes array param if any item is disallowed", () => {
      pageParamsManager.registerDynamicAllowedValues("tags", ["tagA", "tagB"]);
      const params = new URLSearchParams({ tags: "tagA,invalidTag" });
      const sanitized = pageParamsManager.sanitizeSearchParams(params);
      expect(sanitized.has("tags")).toBe(false);
    });

    it("keeps array param if all items are allowed", () => {
      pageParamsManager.registerDynamicAllowedValues("tags", ["tagA", "tagB"]);
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
      const testPageSize = 99;
      const params = new URLSearchParams({
        currentPage: "10",
        pageSize: String(testPageSize),
      });
      const parsed = pageParamsManager.getParsedParams(params);
      expect(parsed.currentPage).toBe(10);
      expect(parsed.pageSize).toBe(testPageSize);
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

  describe("registerDynamicAllowedValues", () => {
    it("properly sets dynamic values and affects sanitization", () => {
      pageParamsManager.registerDynamicAllowedValues("type", [
        "type1",
        "type2",
      ]);
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

  describe("clearDynamicAllowedValues", () => {
    it("removes dynamic values so the param is no longer restricted", () => {
      pageParamsManager.registerDynamicAllowedValues("type", ["type1"]);
      pageParamsManager.clearDynamicAllowedValues("type");

      const params = new URLSearchParams({ type: "type2" });

      expect(pageParamsManager.sanitizeSearchParams(params).get("type")).toBe(
        "type2",
      );
    });
  });

  describe("dynamic allowed values registrations", () => {
    it("uses the newest registration as the effective rule", () => {
      pageParamsManager.registerDynamicAllowedValues("type", ["type1"]);
      pageParamsManager.registerDynamicAllowedValues("type", ["type2"]);

      const params = new URLSearchParams({ type: "type1" });

      expect(pageParamsManager.sanitizeSearchParams(params).has("type")).toBe(
        false,
      );
    });

    it("restores the previous registration when the newest one unregisters", () => {
      pageParamsManager.registerDynamicAllowedValues("type", ["type1"]);
      const secondId = pageParamsManager.registerDynamicAllowedValues("type", [
        "type2",
      ]);

      pageParamsManager.unregisterDynamicAllowedValues("type", secondId);

      const params = new URLSearchParams({ type: "type1" });

      expect(pageParamsManager.sanitizeSearchParams(params).get("type")).toBe(
        "type1",
      );
    });

    it("handles unregistration out of order", () => {
      const firstId = pageParamsManager.registerDynamicAllowedValues("type", [
        "type1",
      ]);
      const secondId = pageParamsManager.registerDynamicAllowedValues("type", [
        "type2",
      ]);
      pageParamsManager.registerDynamicAllowedValues("type", ["type3"]);

      pageParamsManager.unregisterDynamicAllowedValues("type", secondId);

      let params = new URLSearchParams({ type: "type3" });

      expect(pageParamsManager.sanitizeSearchParams(params).get("type")).toBe(
        "type3",
      );

      pageParamsManager.unregisterDynamicAllowedValues("type", firstId);

      params = new URLSearchParams({ type: "type1" });

      expect(pageParamsManager.sanitizeSearchParams(params).has("type")).toBe(
        false,
      );
    });

    it("clearDynamicAllowedValues removes the whole registration stack", () => {
      pageParamsManager.registerDynamicAllowedValues("type", ["type1"]);
      pageParamsManager.registerDynamicAllowedValues("type", ["type2"]);

      pageParamsManager.clearDynamicAllowedValues("type");

      const params = new URLSearchParams({ type: "anything" });

      expect(pageParamsManager.sanitizeSearchParams(params).get("type")).toBe(
        "anything",
      );
    });
  });

  describe("getCurrentPageParam", () => {
    it("returns the urlParam for current page", () => {
      expect(pageParamsManager.getCurrentPageParam()).toBe("currentPage");
    });
  });
});

describe("slot-scoped tab values", () => {
  const parse = (search: string) =>
    pageParamsManager.getParsedParams(new URLSearchParams(search));

  const sanitize = (search: string) =>
    decodeURIComponent(
      pageParamsManager
        .sanitizeSearchParams(new URLSearchParams(search))
        .toString(),
    );

  describe("getParsedParams", () => {
    it("separates the page tab from slot values", () => {
      const parsed = parse(
        "tab=scripts&tab=panel:code&tab=upgrades:packages&sidePath=view",
      );

      expect(parsed.tab).toBe("scripts");
      expect(parsed.tabSlots).toEqual({ panel: "code", upgrades: "packages" });
      expect(parsed.sidePath).toEqual(["view"]);
    });

    it("parses slot values without a page tab, in any order", () => {
      const parsed = parse("tab=activities:in-progress&tab=profiles");

      expect(parsed.tab).toBe("profiles");
      expect(parsed.tabSlots).toEqual({ activities: "in-progress" });
    });

    it("parses percent-encoded separators", () => {
      expect(parse("tab=panel%3Acode").tabSlots).toEqual({ panel: "code" });
    });

    it("keeps the first value of each kind", () => {
      const parsed = parse("tab=a&tab=b&tab=panel:info&tab=panel:code");

      expect(parsed.tab).toBe("a");
      expect(parsed.tabSlots).toEqual({ panel: "info" });
    });

    it("ignores malformed and unknown slot values", () => {
      const parsed = parse(
        "tab=bogus:x&tab=panel:&tab=:code&tab=panel:a:b&tab=",
      );

      expect(parsed.tab).toBe("");
      expect(parsed.tabSlots).toEqual({});
    });

    it("defaults to no tab state", () => {
      expect(parse("")).toMatchObject({ tab: "", tabSlots: {} });
    });
  });

  describe("sanitizeSearchParams", () => {
    it("leaves a clean URL unchanged", () => {
      const search =
        "tab=profiles&tab=panel:activity-history&sidePath=view&name=1";

      expect(sanitize(search)).toBe(search);
    });

    it("drops malformed, unknown, duplicate and shadowed tab values", () => {
      expect(
        sanitize(
          "tab=panel:code&tab=bogus:x&tab=&tab=panel:code&tab=panel:info&tab=upgrades:packages&tab=a&tab=b",
        ),
      ).toBe("tab=panel:code&tab=upgrades:packages&tab=a");
    });
  });

  describe("getTabSearchParams", () => {
    const getSearch = (
      search: string,
      target: Parameters<typeof pageParamsManager.getTabSearchParams>[1],
    ) =>
      decodeURIComponent(
        pageParamsManager
          .getTabSearchParams(new URLSearchParams(search), target)
          .toString(),
      );

    it("drops every other param for a page tab", () => {
      expect(
        getSearch("tab=scripts&tab=panel:code&search=x&sidePath=view", {
          id: "profiles",
        }),
      ).toBe("tab=profiles");
    });

    it("changes only its slot for a slot tab", () => {
      expect(
        getSearch("search=x&tab=scripts&tab=panel:code&tab=upgrades:usns", {
          slot: "panel",
          id: "info",
        }),
      ).toBe("tab=scripts&tab=panel:info&tab=upgrades:usns&search=x");
    });

    it("removes its slot for an empty id", () => {
      expect(
        getSearch("tab=scripts&tab=panel:code", { slot: "panel", id: "" }),
      ).toBe("tab=scripts");
    });

    it("drops invalid params while merging", () => {
      expect(
        getSearch("tab=bogus:x&unknown=1&currentPage=1", {
          slot: "activities",
          id: "in-progress",
        }),
      ).toBe("tab=activities:in-progress");
    });
  });
});
