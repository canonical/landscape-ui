import { Config, Packages, WrittenConfig } from "@changesets/types";
//#region src/parse.d.ts
type ParseResult = {
  config: Config;
  warnings: string[];
  errors: undefined;
} | {
  config: undefined;
  warnings: string[];
  errors: string[];
};
declare function validateConfig(json: unknown, packages: Packages): ParseResult;
declare function readConfig(cwd?: string, packages?: Packages): Promise<ParseResult>;
//#endregion
//#region src/defaults.d.ts
declare const defaultWrittenConfig: WrittenConfig;
declare const defaultConfig: Config;
//#endregion
export { defaultConfig, defaultWrittenConfig, readConfig, validateConfig };