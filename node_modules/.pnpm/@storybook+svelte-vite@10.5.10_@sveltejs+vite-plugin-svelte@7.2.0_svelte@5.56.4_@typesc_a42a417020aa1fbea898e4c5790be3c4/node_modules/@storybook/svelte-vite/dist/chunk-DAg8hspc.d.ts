import { CompatibleString, StorybookConfig } from "storybook/internal/types";
import { BuilderOptions, StorybookConfigVite } from "@storybook/builder-vite";

//#region code/frameworks/svelte-vite/.dts-emit/code/frameworks/svelte-vite/src/types.d.ts
type FrameworkName = CompatibleString<'@storybook/svelte-vite'>;
type BuilderName = CompatibleString<'@storybook/builder-vite'>;
type FrameworkOptions = {
  builder?: BuilderOptions;
  /**
   * Enable or disable automatic documentation generation for component properties, events, and
   * slots. When disabled, Storybook will skip the docgen processing step during build, which can
   * improve build performance.
   *
   * @default true
   */
  docgen?: boolean;
};
type StorybookConfigFramework = {
  framework: FrameworkName | {
    name: FrameworkName;
    options: FrameworkOptions;
  };
  core?: StorybookConfig['core'] & {
    builder?: BuilderName | {
      name: BuilderName;
      options: BuilderOptions;
    };
  };
};
/** The interface for Storybook configuration in `main.ts` files. */
type StorybookConfig$1 = Omit<StorybookConfig, keyof StorybookConfigVite | keyof StorybookConfigFramework> & StorybookConfigVite & StorybookConfigFramework;
//#endregion
export { StorybookConfig$1 as n, FrameworkOptions as t };