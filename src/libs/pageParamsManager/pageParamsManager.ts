import type { PageParams, ParamDefinition, ParamsConfig } from "./types";
import { PARAMS_CONFIG } from "./constants";

class PageParamsManager {
  /** A map to store dynamic allowed values for certain params. */
  private dynamicAllowedValues = new Map<
    keyof PageParams,
    Set<string | number>
  >();

  /** You can optionally pass a custom config; defaults to PARAMS_CONFIG. */
  constructor(private readonly config: ParamsConfig = PARAMS_CONFIG) {}

  /**
   * Adds or replaces the dynamic allowed values for a given paramKey.
   * Only these values (or numbers matching them) will be considered valid.
   */
  public setDynamicAllowedValues(
    paramKey: keyof PageParams,
    values: (string | number)[],
  ): void {
    this.dynamicAllowedValues.set(paramKey, new Set(values));
  }

  /**
   * Convert the raw URLSearchParams into typed "PageParams".
   *  - Arrays are split by comma
   *  - Numbers are parsed by parseInt (fallback to default if NaN)
   *  - Strings are used as-is
   *  - null defaults (e.g., for "sort") are used if missing
   */
  public getParsedParams(searchParams: URLSearchParams): Required<PageParams> {
    const parsed = {} as PageParams;

    for (const definition of this.config) {
      const { urlParam, defaultValue, isArray } = definition;
      const rawValue = searchParams.get(urlParam);

      // If nothing is provided, just use the default
      if (rawValue === null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (parsed as any)[urlParam] = defaultValue;
        continue;
      }

      // If the param is array-based, split by comma
      if (isArray) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (parsed as any)[urlParam] = rawValue.split(",");
        continue;
      }

      // If the default is a number, try parseInt
      if (typeof defaultValue === "number") {
        const n = parseInt(rawValue, 10);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (parsed as any)[urlParam] = Number.isNaN(n) ? defaultValue : n;
        continue;
      }

      // If the default is null, we treat it as "could be any string,"
      // but keep the raw string
      if (defaultValue === null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (parsed as any)[urlParam] = rawValue;
        continue;
      }

      // Otherwise, it's a normal string default
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (parsed as any)[urlParam] = rawValue;
    }

    // Ensure we return a fully typed object
    return parsed as Required<PageParams>;
  }

  /**
   * Removes invalid or redundant parameters from a given URLSearchParams.
   * E.g. if a param is unknown, equals its default, fails validation, etc.
   */
  public sanitizeSearchParams(params: URLSearchParams): URLSearchParams {
    const newParams = new URLSearchParams(params);

    // Check each key/value to see if we should keep or remove
    for (const key of newParams.keys()) {
      const value = newParams.get(key);
      if (!this.shouldKeepParam(key, value)) {
        newParams.delete(key);
      }
    }

    return newParams;
  }

  /**
   * Check if a given (key, value) pair is valid and should remain in the URL.
   */
  private shouldKeepParam(key: string, value: string | null): boolean {
    // If there's literally no value, remove it
    if (value === null) return false;

    // Find the definition in our config
    const definition = Object.values(this.config).find(
      (def) => def.urlParam === key,
    );
    // If there's no recognized config for this key, remove it
    if (!definition) return false;

    const { defaultValue, validator, isArray } = definition;

    // Check if the value is effectively the same as the default (so we can remove)
    if (defaultValue !== null) {
      if (Array.isArray(defaultValue)) {
        // If default is an array, compare to the comma-joined string
        if (value === "" || value.split(",").length === 0) {
          return false;
        }
        if (value.split(",").join(",") === defaultValue.join(",")) {
          return false;
        }
      } else {
        // It's a string or number
        if (String(defaultValue) === value) {
          return false;
        }
      }
    } else {
      // If defaultValue = null, we interpret an empty string as "no real value"
      if (value === "") {
        return false;
      }
    }

    // If there's a dynamic-allowed-values set for this param, check membership
    const allowedSet = this.dynamicAllowedValues.get(definition.urlParam);
    if (allowedSet) {
      if (isArray) {
        // For array-based, ensure *every* item is in the allowed set
        const items = value.split(",");
        if (!items.every((item) => allowedSet.has(item))) {
          return false;
        }
      } else {
        // For single-value, check if the set has this value or a numeric version
        if (!(allowedSet.has(value) || allowedSet.has(Number(value)))) {
          return false;
        }
      }
    }

    // Finally, if a custom validator is defined, ensure it passes
    if (validator && !validator(value)) {
      return false;
    }

    return true;
  }

  /**
   * Determine if any param that *requires* a page-reset is present in newParams.
   */
  public shouldResetPage(newParams: Partial<PageParams>): boolean {
    return Object.values(this.config)
      .filter((def) => def.shouldResetPage)
      .some((def) => def.urlParam in newParams);
  }

  /**
   * A small helper to retrieve the "currentPage" URL param name,
   * in case you need it externally.
   */
  public getCurrentPageParam(): string {
    return this.getParamDefinition("currentPage").urlParam;
  }

  public getParamDefinition(paramKey: keyof PageParams): ParamDefinition {
    const def = this.config.find((def) => def.urlParam === paramKey);

    if (!def) {
      throw new Error(`No definition found for param key: ${paramKey}`);
    }

    return def;
  }
}

const pageParamsManager = new PageParamsManager();

export default pageParamsManager;
