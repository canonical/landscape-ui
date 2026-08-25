import { Agent } from "package-manager-detector";

//#region src/formatters.d.ts
type FormatterName = "prettier" | "biome" | "oxfmt" | "deno" | "dprint";
//#endregion
//#region src/detect.d.ts
declare const defaultDetectOrder: readonly FormatterName[];
interface DetectOptions {
  /**
   * The current working directory to start looking up for the formatter.
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * The path to stop traversing up the directory.
   */
  stopDir?: string;
  /**
   * The order of formatters to check for.
   * @default ["dprint", "deno", "oxfmt", "biome", "prettier"] // from `defaultDetectOrder`
   */
  order?: FormatterName[];
}
/**
 * Detect the preferred formatter used in the project.
 */
declare function detect(options?: DetectOptions): Promise<FormatterName | undefined>;
//#endregion
//#region src/format.d.ts
interface FormatOptions {
  /**
   * The formatter to use for formatting. It not specified, it will be auto-detected using
   * {@link detect}. Use {@link detect} directly if you want to have more control over the
   * detection process.
   */
  formatter?: FormatterName;
  /**
   * The current working directory to start looking up for the formatter and package manager,
   * and to execute the formatter's command from.
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * The path to stop traversing up the directory.
   */
  stopDir?: string;
  /**
   * The package manager to use for executing the formatter's command. If not specified, it will use
   * `package-manager-detector` to detect the package manager.
   */
  packageManager?: Agent;
}
/**
 * Format the given patterns with a specified or auto-detected formatter. It returns `true` if a
 * formatter is found and the formatting process passes, otherwise returns `false`.
 */
declare function format(patterns: string[], options?: FormatOptions): Promise<boolean>;
//#endregion
export { type DetectOptions, type FormatOptions, type FormatterName, defaultDetectOrder, detect, format };