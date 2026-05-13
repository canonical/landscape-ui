import type { Page, TestInfo } from "@playwright/test";

// Foundation stub — filled by Workstream D.
//
// The signature below is the locked contract that downstream a11y specs
// (`e2e/features/a11y/*.spec.ts`) import. WS-D replaces the body with the
// real AxeBuilder call:
//
//   const results = await new AxeBuilder({ page })
//     .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
//     ...
//     .analyze();
//   await testInfo.attach(`axe-${label}.json`, { body: ..., contentType: "application/json" });
//   const blocking = results.violations.filter(v => v.impact === "serious" || v.impact === "critical");
//   expect(blocking).toEqual([]);

interface ScanOptions {
  readonly include?: string;
  readonly exclude?: readonly string[];
  readonly tags?: readonly string[];
}

export async function scanA11y(
  _page: Page,
  _testInfo: TestInfo,
  label: string,
  _options: ScanOptions = {},
): Promise<void> {
  throw new Error(
    `scanA11y("${label}") is a foundation stub. ` +
      "Workstream D must implement it using @axe-core/playwright. " +
      "See /home/rubin.aga@canonical.com/.claude/plans/elegant-churning-lobster.md.",
  );
}
