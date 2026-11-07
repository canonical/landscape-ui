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

// Vitest 5 no longer reads matcher types from the global `jest.Matchers`
// interface, which is what `@testing-library/jest-dom` augments, so register
// both the jest-dom matchers and ours on Vitest's `Matchers` instead.
declare module "vitest" {
  interface Matchers<R extends void | Promise<void> = void | Promise<void>>
    extends
      TestingLibraryMatchers<ReturnType<ExpectStatic["stringContaining"]>, R>,
      CustomMatchers<R> {}
}
