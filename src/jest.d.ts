import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import type { ExpectStatic } from "vitest";

// Custom matchers registered with `expect.extend` in src/tests/setup.ts.
interface CustomMatchers<R> {
  toBeOffScreen: () => R;
  toHaveTexts: (texts: string[]) => R;
  toHaveInputValues: (values: string[]) => R;
  toHaveInfoItem: (label: string, value: string | object) => R;
  toHaveIcon: (icon: string) => R;
}

// Vitest 5 ignores the global `jest.Matchers` that jest-dom augments, so
// register jest-dom's matchers and ours on Vitest's `Matchers`.
declare module "vitest" {
  interface Matchers<R extends void | Promise<void> = void | Promise<void>>
    extends
      TestingLibraryMatchers<ReturnType<ExpectStatic["stringContaining"]>, R>,
      CustomMatchers<R> {}
}
