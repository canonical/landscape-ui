import { describe, expect, test } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const sets = require("./audit-sets.cjs") as {
  a: { defaultMinScore: number; assertions: Record<string, unknown> };
  aa: { defaultMinScore: number; assertions: Record<string, unknown> };
  aaa: { defaultMinScore: number; assertions: Record<string, unknown> };
};

describe("audit-sets", () => {
  test.each(["a", "aa", "aaa"] as const)(
    "level %s exports { defaultMinScore, assertions }",
    (level) => {
      expect(sets[level]).toEqual(
        expect.objectContaining({
          defaultMinScore: expect.any(Number),
          assertions: expect.any(Object),
        }),
      );
    },
  );

  test("default floors are 0.85 / 0.90 / 0.95", () => {
    expect(sets.a.defaultMinScore).toBe(0.85);
    expect(sets.aa.defaultMinScore).toBe(0.9);
    expect(sets.aaa.defaultMinScore).toBe(0.95);
  });

  test("aa assertion keys are a strict superset of a", () => {
    const a = new Set(Object.keys(sets.a.assertions));
    const aa = new Set(Object.keys(sets.aa.assertions));
    for (const key of a) {
      expect(aa.has(key)).toBe(true);
    }
    expect(aa.size).toBeGreaterThan(a.size);
  });

  test("aaa assertion keys are a strict superset of aa", () => {
    const aa = new Set(Object.keys(sets.aa.assertions));
    const aaa = new Set(Object.keys(sets.aaa.assertions));
    for (const key of aa) {
      expect(aaa.has(key)).toBe(true);
    }
    expect(aaa.size).toBeGreaterThan(aa.size);
  });

  test("every assertion value is a [severity, opts] tuple", () => {
    for (const level of ["a", "aa", "aaa"] as const) {
      for (const [auditId, value] of Object.entries(sets[level].assertions)) {
        expect(Array.isArray(value), `${level}.${auditId} should be a tuple`).toBe(
          true,
        );
        const tuple = value as unknown[];
        expect(tuple).toHaveLength(2);
        expect(["error", "warn"]).toContain(tuple[0]);
      }
    }
  });

  test("aa includes color-contrast as error; a does not include it", () => {
    expect(sets.aa.assertions["color-contrast"]).toEqual([
      "error",
      expect.any(Object),
    ]);
    expect(sets.a.assertions).not.toHaveProperty("color-contrast");
  });

  test("aaa includes target-size as warn", () => {
    expect(sets.aaa.assertions["target-size"]).toEqual([
      "warn",
      expect.any(Object),
    ]);
  });
});
