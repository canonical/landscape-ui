import type {
  PageParams,
  ParamDefinition,
  ParamsConfig,
  TabSlot,
  TabSlots,
} from "./types";
import { PARAMS_CONFIG } from "./constants";
import { parseTabValue, setTabValues, TAB_PARAM } from "./tabValues";

interface DynamicAllowedValuesRegistration {
  id: number;
  values: Set<string | number>;
}

class PageParamsManager {
  /** Effective dynamic allowed values per param: the newest live registration. */
  private dynamicAllowedValues = new Map<
    keyof PageParams,
    Set<string | number>
  >();

  /** Per-param registrations, oldest first. Last entry is the effective one. */
  private dynamicAllowedValuesStacks = new Map<
    keyof PageParams,
    DynamicAllowedValuesRegistration[]
  >();

  private nextDynamicAllowedValuesId = 1;

  /** You can optionally pass a custom config; defaults to PARAMS_CONFIG. */
  constructor(private readonly config: ParamsConfig = PARAMS_CONFIG) {}

  /**
   * Registers dynamic allowed values on top of any existing registration for
   * the same paramKey. Returns an id for unregisterDynamicAllowedValues.
   */
  public registerDynamicAllowedValues(
    paramKey: keyof PageParams,
    values: (string | number)[],
  ): number {
    const stack = this.dynamicAllowedValuesStacks.get(paramKey) ?? [];
    const id = this.nextDynamicAllowedValuesId++;
    this.dynamicAllowedValuesStacks.set(paramKey, [
      ...stack,
      { id, values: new Set(values) },
    ]);
    this.syncDynamicAllowedValues(paramKey);
    return id;
  }

  /**
   * Removes a single registration. If older registrations remain for the
   * paramKey, the newest of those becomes effective again.
   */
  public unregisterDynamicAllowedValues(
    paramKey: keyof PageParams,
    registrationId: number,
  ): void {
    const stack = this.dynamicAllowedValuesStacks.get(paramKey);

    if (!stack) {
      return;
    }

    const remaining = stack.filter(({ id }) => id !== registrationId);

    if (remaining.length) {
      this.dynamicAllowedValuesStacks.set(paramKey, remaining);
    } else {
      this.dynamicAllowedValuesStacks.delete(paramKey);
    }

    this.syncDynamicAllowedValues(paramKey);
  }

  /** Removes every registration for the given paramKey. */
  public clearDynamicAllowedValues(paramKey: keyof PageParams): void {
    this.dynamicAllowedValuesStacks.delete(paramKey);
    this.syncDynamicAllowedValues(paramKey);
  }

  /** Removes every registration for every paramKey. */
  public clearAllDynamicAllowedValues(): void {
    this.dynamicAllowedValuesStacks.clear();
    this.dynamicAllowedValues.clear();
  }

  private syncDynamicAllowedValues(paramKey: keyof PageParams): void {
    const stack = this.dynamicAllowedValuesStacks.get(paramKey);
    const effective = stack?.[stack.length - 1];

    if (effective) {
      this.dynamicAllowedValues.set(paramKey, effective.values);
    } else {
      this.dynamicAllowedValues.delete(paramKey);
    }
  }

  /**
   * Convert the raw URLSearchParams into typed "PageParams".
   *  - Arrays are split by comma
   *  - Numbers are parsed by parseInt (fallback to default if NaN)
   *  - Strings are used as-is
   *  - null defaults (e.g., for "sort") are used if missing
   */
  public getParsedParams(searchParams: URLSearchParams): Required<PageParams> {
    const parsedEntries = this.config.map(({ urlParam, defaultValue }) => {
      const rawValue = searchParams.get(urlParam);

      if (rawValue === null) {
        return [urlParam, defaultValue];
      }

      if (Array.isArray(defaultValue)) {
        return [urlParam, rawValue.split(",")];
      }

      if (typeof defaultValue === "number") {
        const parsedNumber = parseInt(rawValue, 10);
        return [
          urlParam,
          Number.isNaN(parsedNumber) ? defaultValue : parsedNumber,
        ];
      }

      return [urlParam, rawValue];
    });

    return {
      ...Object.fromEntries(parsedEntries),
      ...this.parseTabValues(searchParams),
    };
  }

  /**
   * The repeated "tab" param carries the page-level tab as a bare value and
   * each slot-scoped tab as "slot:id". The first valid value of each kind
   * wins; invalid values are ignored (and dropped by sanitizeSearchParams).
   */
  public parseTabValues(searchParams: URLSearchParams): {
    tab: string;
    tabSlots: TabSlots;
  } {
    let tab = "";
    const tabSlots: TabSlots = {};

    for (const rawValue of searchParams.getAll(TAB_PARAM)) {
      const value = parseTabValue(rawValue);

      if (value?.kind === "page" && !tab) {
        tab = value.id;
      } else if (value?.kind === "slot" && !tabSlots[value.slot]) {
        tabSlots[value.slot] = value.id;
      }
    }

    return { tab, tabSlots };
  }

  /**
   * Rewrites every "tab" value in place: the bare page tab first, then the
   * non-empty slot values sorted by slot name.
   */
  /**
   * The search params a tab link navigates to.
   * - Page-level strip: only "tab=<id>", so switching page tabs starts from a
   *   clean state (filters, pagination and side panels are dropped).
   * - Slot strip: the current params with only that slot changed; an empty
   *   id removes the slot so its default tab applies.
   */
  public getTabSearchParams(
    searchParams: URLSearchParams,
    target: { slot?: TabSlot; id: string },
  ): URLSearchParams {
    if (!target.slot) {
      return new URLSearchParams({ [TAB_PARAM]: target.id });
    }

    const { tab, tabSlots } = this.parseTabValues(searchParams);
    const nextSearchParams = new URLSearchParams(searchParams);

    setTabValues(nextSearchParams, tab, {
      ...tabSlots,
      [target.slot]: target.id,
    });

    return this.sanitizeSearchParams(nextSearchParams);
  }

  /**
   * Removes invalid or redundant parameters from a given URLSearchParams.
   * E.g. if a param is unknown, equals its default, fails validation, etc.
   */
  public sanitizeSearchParams(params: URLSearchParams): URLSearchParams {
    const newParams = new URLSearchParams();
    const { tab, tabSlots } = this.parseTabValues(params);
    let hasWrittenTabValues = false;

    // Rebuild in the original key order so a clean URL stays byte-identical.
    for (const [key, value] of params) {
      if (key === TAB_PARAM) {
        if (!hasWrittenTabValues) {
          hasWrittenTabValues = true;
          this.appendSanitizedTabValues(newParams, params, tab, tabSlots);
        }
      } else if (this.shouldKeepParam(key, params.get(key))) {
        newParams.append(key, value);
      }
    }

    return newParams;
  }

  /**
   * Keeps the first valid page value and the first valid value per slot,
   * in their original order; drops empty, malformed and duplicate values.
   */
  private appendSanitizedTabValues(
    target: URLSearchParams,
    source: URLSearchParams,
    tab: string,
    tabSlots: TabSlots,
  ): void {
    const kept = new Set<string>();

    for (const rawValue of source.getAll(TAB_PARAM)) {
      const value = parseTabValue(rawValue);
      const isFirstOfKind =
        value?.kind === "page"
          ? value.id === tab
          : value?.kind === "slot" && tabSlots[value.slot] === value.id;

      if (isFirstOfKind && !kept.has(rawValue)) {
        kept.add(rawValue);
        target.append(TAB_PARAM, rawValue);
      }
    }
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

    const { defaultValue, validator } = definition;
    const isArray = Array.isArray(defaultValue);

    // Check if the value is effectively the same as the default (so we can remove)
    if (defaultValue !== null) {
      if (isArray) {
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

  public getParamDefinition(
    paramKey: keyof PageParams,
  ): ParamDefinition<keyof PageParams> {
    const def = this.config.find((item) => item.urlParam === paramKey);

    if (!def) {
      throw new Error(`No definition found for param key: ${paramKey}`);
    }

    return def;
  }
}

const pageParamsManager = new PageParamsManager();

export default pageParamsManager;
