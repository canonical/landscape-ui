import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { resolve } from "node:path";

type BuildCommentArgs = {
  resultsDir: string;
  mode?: string;
  artifactUrl?: string;
  manifestFile?: string;
};

type BuildCommentModule = {
  buildComment: (args: BuildCommentArgs) => string;
  WCAG_MAP: Record<string, string>;
  emojiForScore: (score: number) => string;
  banner: (mode?: string) => string;
  main: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mod = require("./build-comment.cjs") as BuildCommentModule;
const { buildComment, WCAG_MAP, main } = mod;

const FIXTURES = resolve(__dirname, "__fixtures__");

describe("build-comment", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("mixed manifest", () => {
    test("renders 🟢, 🟡, 🔴 rows in order with the URL path in the first column", () => {
      const out = buildComment({
        resultsDir: FIXTURES,
        manifestFile: "manifest-mixed.json",
      });

      const rows = out
        .split("\n")
        .filter((line) => line.startsWith("| `/"));
      expect(rows).toHaveLength(3);
      expect(rows[0]).toContain("`/login`");
      expect(rows[0]).toContain("🟢");
      expect(rows[1]).toContain("`/create-account`");
      expect(rows[1]).toContain("🟡");
      expect(rows[2]).toContain("`/no-access`");
      expect(rows[2]).toContain("🔴");
    });

    test("amber row lists both failing audits with their WCAG mapping", () => {
      const out = buildComment({
        resultsDir: FIXTURES,
        manifestFile: "manifest-mixed.json",
      });
      const amber = out.split("\n").find((l) => l.includes("create-account"));

      expect(amber).toContain("`color-contrast` (WCAG 1.4.3)");
      expect(amber).toContain("`button-name` (WCAG 4.1.2)");
      expect(amber).not.toContain("+");
    });

    test("red row with >3 failing audits lists the top 3 plus (+N more)", () => {
      const out = buildComment({
        resultsDir: FIXTURES,
        manifestFile: "manifest-mixed.json",
      });
      const red = out.split("\n").find((l) => l.includes("no-access"));

      expect(red).toContain("`aria-required-attr`");
      expect(red).toContain("`label`");
      expect(red).toContain("`link-name`");
      expect(red).toMatch(/\(\+\d+ more\)/);
    });
  });

  describe("banners", () => {
    test("LHCI_MODE=block → banner contains 'Blocking'", () => {
      const out = buildComment({ resultsDir: FIXTURES, mode: "block" });
      expect(out).toContain("Blocking");
      expect(out).not.toContain("Annotate-only");
    });

    test("LHCI_MODE=annotate → banner contains 'Annotate-only'", () => {
      const out = buildComment({ resultsDir: FIXTURES, mode: "annotate" });
      expect(out).toContain("Annotate-only");
    });

    test("LHCI_MODE unset → defaults to 'Annotate-only' (the safer default)", () => {
      const out = buildComment({ resultsDir: FIXTURES });
      expect(out).toContain("Annotate-only");
    });
  });

  describe("artifact link", () => {
    test("LHCI_ARTIFACT_URL set → includes `[Full report artifact](url)`", () => {
      const out = buildComment({
        resultsDir: FIXTURES,
        manifestFile: "manifest-mixed.json",
        artifactUrl: "https://example/artifact/9",
      });
      expect(out).toContain("[Full report artifact](https://example/artifact/9)");
    });

    test("LHCI_ARTIFACT_URL unset → no broken artifact line", () => {
      const out = buildComment({
        resultsDir: FIXTURES,
        manifestFile: "manifest-mixed.json",
      });
      expect(out).not.toContain("Full report artifact");
      expect(out).not.toMatch(/\[]\(\)/);
    });
  });

  describe("missing manifest", () => {
    test("buildComment returns the warning Markdown without throwing", () => {
      const out = buildComment({ resultsDir: "/does/not/exist" });
      expect(out).toContain(
        "Lighthouse did not produce a manifest; see the job logs",
      );
    });

    test("main() exits 0 and prints warning Markdown when manifest is missing", () => {
      const originalExit = process.exit;
      const originalWrite = process.stdout.write.bind(process.stdout);
      const exitCalls: number[] = [];
      const writes: string[] = [];

      process.exit = ((code?: number) => {
        exitCalls.push(code ?? 0);
      }) as typeof process.exit;
      process.stdout.write = ((chunk: unknown) => {
        writes.push(String(chunk));
        return true;
      }) as typeof process.stdout.write;

      vi.stubEnv("LHCI_RESULTS_DIR", "/does/not/exist");
      try {
        main();
      } finally {
        process.exit = originalExit;
        process.stdout.write = originalWrite;
      }

      expect(exitCalls).toEqual([0]);
      expect(writes.join("")).toContain(
        "Lighthouse did not produce a manifest",
      );
    });
  });

  describe("all-green manifest", () => {
    test("each row uses the `—` placeholder, never a stray empty audits cell", () => {
      const out = buildComment({
        resultsDir: FIXTURES,
        manifestFile: "manifest-all-green.json",
      });

      const rows = out
        .split("\n")
        .filter((line) => line.startsWith("| `/"));
      expect(rows).toHaveLength(3);
      for (const row of rows) {
        expect(row).toContain("🟢");
        expect(row).toMatch(/\|\s+—\s+\|/);
      }
      expect(out).not.toContain("failing audits |\n| `");
    });
  });

  describe("WCAG mapping is consistent with audit-sets.cjs", () => {
    test.each([
      ["color-contrast", "1.4.3"],
      ["button-name", "4.1.2"],
      ["image-alt", "1.1.1"],
    ] as const)("%s → %s", (auditId, expected) => {
      expect(WCAG_MAP[auditId]).toBe(expected);
    });
  });
});
