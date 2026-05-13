import { describe, expect, test } from "vitest";

type CreateBaseConfig = (opts: {
  wcagLevel: "a" | "aa" | "aaa";
  urls: string[];
  numberOfRuns?: number;
  settingsOverrides?: Record<string, unknown>;
  minScore?: number;
}) => {
  ci: {
    collect: {
      url: string[];
      numberOfRuns: number;
      settings: Record<string, unknown>;
    };
    assert: { assertions: Record<string, [string, { minScore: number }]> };
    upload: {
      target: string;
      outputDir: string;
      reportFilenamePattern: string;
    };
  };
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const baseModule = require("./lighthouserc.base.cjs") as {
  createBaseConfig: CreateBaseConfig;
};
const createBaseConfig = baseModule.createBaseConfig;

describe("createBaseConfig", () => {
  test("returns { ci: { collect, assert, upload } } for happy path", () => {
    const cfg = createBaseConfig({
      wcagLevel: "aa",
      urls: ["http://x"],
    });
    expect(cfg).toHaveProperty("ci.collect");
    expect(cfg).toHaveProperty("ci.assert");
    expect(cfg).toHaveProperty("ci.upload");
  });

  test("collect.url equals the input array", () => {
    const urls = ["http://x", "http://y"];
    const cfg = createBaseConfig({ wcagLevel: "aa", urls });
    expect(cfg.ci.collect.url).toEqual(urls);
  });

  test("numberOfRuns defaults to 1 and explicit value flows through", () => {
    const defaulted = createBaseConfig({ wcagLevel: "aa", urls: ["http://x"] });
    expect(defaulted.ci.collect.numberOfRuns).toBe(1);

    const explicit = createBaseConfig({
      wcagLevel: "aa",
      urls: ["http://x"],
      numberOfRuns: 3,
    });
    expect(explicit.ci.collect.numberOfRuns).toBe(3);
  });

  test("collect.settings.onlyCategories is ['accessibility']", () => {
    const cfg = createBaseConfig({ wcagLevel: "aa", urls: ["http://x"] });
    expect(cfg.ci.collect.settings.onlyCategories).toEqual(["accessibility"]);
  });

  test("preset defaults to 'desktop'; settingsOverrides override preset while preserving rest", () => {
    const defaulted = createBaseConfig({ wcagLevel: "aa", urls: ["http://x"] });
    expect(defaulted.ci.collect.settings.preset).toBe("desktop");

    const overridden = createBaseConfig({
      wcagLevel: "aa",
      urls: ["http://x"],
      settingsOverrides: { preset: "mobile" },
    });
    expect(overridden.ci.collect.settings.preset).toBe("mobile");
    expect(overridden.ci.collect.settings.onlyCategories).toEqual([
      "accessibility",
    ]);
    expect(overridden.ci.collect.settings.chromeFlags).toBe(
      "--no-sandbox --headless=new --disable-gpu",
    );
  });

  test("AA default floor is ['error', { minScore: 0.9 }]", () => {
    const cfg = createBaseConfig({ wcagLevel: "aa", urls: ["http://x"] });
    expect(cfg.ci.assert.assertions["categories:accessibility"]).toEqual([
      "error",
      { minScore: 0.9 },
    ]);
  });

  test("minScore override flows into categories:accessibility floor", () => {
    const cfg = createBaseConfig({
      wcagLevel: "aa",
      urls: ["http://x"],
      minScore: 0.5,
    });
    expect(
      cfg.ci.assert.assertions["categories:accessibility"][1].minScore,
    ).toBe(0.5);
  });

  test("AA assertions include color-contrast; A assertions do not", () => {
    const aa = createBaseConfig({ wcagLevel: "aa", urls: ["http://x"] });
    expect(aa.ci.assert.assertions).toHaveProperty("color-contrast");

    const a = createBaseConfig({ wcagLevel: "a", urls: ["http://x"] });
    expect(a.ci.assert.assertions).not.toHaveProperty("color-contrast");
  });

  test("upload targets filesystem at ./.lighthouseci", () => {
    const cfg = createBaseConfig({ wcagLevel: "aa", urls: ["http://x"] });
    expect(cfg.ci.upload.target).toBe("filesystem");
    expect(cfg.ci.upload.outputDir).toBe("./.lighthouseci");
  });

  test("throws when urls is an empty array", () => {
    expect(() =>
      createBaseConfig({ wcagLevel: "aa", urls: [] }),
    ).toThrow(/non-empty/);
  });

  test("throws when urls is undefined", () => {
    expect(() =>
      createBaseConfig({
        wcagLevel: "aa",
        // @ts-expect-error: deliberately invalid for the error-path test
        urls: undefined,
      }),
    ).toThrow();
  });

  test("throws when wcagLevel is unknown, naming the bad level", () => {
    expect(() =>
      createBaseConfig({
        // @ts-expect-error: deliberately invalid for the error-path test
        wcagLevel: "z",
        urls: ["http://x"],
      }),
    ).toThrow(/z/);
  });
});
