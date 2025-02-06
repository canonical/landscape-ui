import moment from "moment";
import { PAGE_SIZE_OPTIONS } from "@/components/layout/TablePagination/components/TablePaginationBase/constants";
import { DAYS_FILTER_OPTIONS } from "@/features/events-log";
import type { PageParams, ParamsConfig, SortDirection } from "./types";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_DAY_INDEX,
  DEFAULT_EMPTY_ARRAY,
  DEFAULT_EMPTY_STRING,
  DEFAULT_PAGE_SIZE_INDEX,
} from "./constants";

class PageParamsManager {
  private static instance: PageParamsManager | null = null;
  private readonly dynamicAllowedValues: Map<string, Set<unknown>>;
  private readonly DEFAULT_PAGE_SIZE: number =
    PAGE_SIZE_OPTIONS[DEFAULT_PAGE_SIZE_INDEX].value;
  private readonly DEFAULT_DAY: string =
    DAYS_FILTER_OPTIONS[DEFAULT_DAY_INDEX].value;

  private constructor() {
    this.dynamicAllowedValues = new Map<string, Set<unknown>>();
  }

  private validateParam(param: string, value: string): boolean {
    const allowed = this.dynamicAllowedValues.get(param);
    return !allowed || allowed.has(value) || allowed.has(Number(value));
  }

  private validateArrayParam(param: string, value: string): boolean {
    const allowed = this.dynamicAllowedValues.get(param);
    return !allowed || value.split(",").every((v) => allowed.has(v));
  }

  private getDefaultArray(): string[] {
    return DEFAULT_EMPTY_ARRAY;
  }

  private getDefaultString(): string {
    return DEFAULT_EMPTY_STRING;
  }

  private getDefaultSortDirection(): SortDirection | null {
    return null;
  }

  private readonly PARAMS = {
    ACCESS_GROUPS: {
      urlParam: "accessGroups" as const,
      shouldResetPage: true,
      getDefaultValue: this.getDefaultArray,
      isValid: (value) => this.validateArrayParam("accessGroups", value),
    },
    AVAILABILITY_ZONES: {
      urlParam: "availabilityZones" as const,
      shouldResetPage: true,
      getDefaultValue: this.getDefaultArray,
      isValid: (value) => this.validateArrayParam("availabilityZones", value),
    },
    CURRENT_PAGE: {
      urlParam: "currentPage" as const,
      shouldResetPage: false,
      getDefaultValue: () => DEFAULT_CURRENT_PAGE,
      isValid: (value) => this.validateParam("currentPage", value),
    },
    DAYS: {
      urlParam: "days" as const,
      shouldResetPage: true,
      getDefaultValue: () => this.DEFAULT_DAY,
      isValid: (value) => this.validateParam("days", value),
    },
    DISABLED_COLUMNS: {
      urlParam: "disabledColumns" as const,
      shouldResetPage: false,
      getDefaultValue: this.getDefaultArray,
      isValid: (value) => this.validateArrayParam("disabledColumns", value),
    },
    FROM_DATE: {
      urlParam: "fromDate" as const,
      shouldResetPage: true,
      getDefaultValue: this.getDefaultString,
      isValid: (value) => moment(value, moment.ISO_8601, true).isValid(),
    },
    GROUP_BY: {
      urlParam: "groupBy" as const,
      shouldResetPage: true,
      getDefaultValue: this.getDefaultString,
      isValid: (value) => this.validateParam("groupBy", value),
    },
    OS: {
      urlParam: "os" as const,
      shouldResetPage: true,
      getDefaultValue: this.getDefaultString,
      isValid: (value) => this.validateParam("os", value),
    },
    PAGE_SIZE: {
      urlParam: "pageSize" as const,
      shouldResetPage: true,
      getDefaultValue: () => this.DEFAULT_PAGE_SIZE,
      isValid: (value) => this.validateParam("pageSize", value),
    },
    SEARCH: {
      urlParam: "search" as const,
      shouldResetPage: true,
      getDefaultValue: this.getDefaultString,
      isValid: () => true,
    },
    SORT: {
      urlParam: "sort" as const,
      shouldResetPage: false,
      getDefaultValue: this.getDefaultSortDirection,
      isValid: (value) => value === "asc" || value === "desc" || value === null,
    },
    SORT_BY: {
      urlParam: "sortBy" as const,
      shouldResetPage: false,
      getDefaultValue: this.getDefaultString,
      isValid: (value) => this.validateParam("sortBy", value),
    },
    STATUS: {
      urlParam: "status" as const,
      shouldResetPage: true,
      getDefaultValue: this.getDefaultString,
      isValid: (value) => this.validateParam("status", value),
    },
    TAB: {
      urlParam: "tab" as const,
      shouldResetPage: false,
      getDefaultValue: this.getDefaultString,
      isValid: () => true,
    },
    TAGS: {
      urlParam: "tags" as const,
      shouldResetPage: true,
      getDefaultValue: this.getDefaultArray,
      isValid: (value) => this.validateArrayParam("tags", value),
    },
    TO_DATE: {
      urlParam: "toDate" as const,
      shouldResetPage: true,
      getDefaultValue: this.getDefaultString,
      isValid: (value) => moment(value, moment.ISO_8601, true).isValid(),
    },
    TYPE: {
      urlParam: "type" as const,
      shouldResetPage: true,
      getDefaultValue: this.getDefaultString,
      isValid: (value) => this.validateParam("type", value),
    },
    QUERY: {
      urlParam: "query" as const,
      shouldResetPage: true,
      getDefaultValue: this.getDefaultString,
      isValid: () => true,
    },
  } as const satisfies ParamsConfig;

  private shouldDeleteParam(key: string, value: string | null): boolean {
    const paramInfo = Object.values(this.PARAMS).find(
      (param) => param.urlParam === key,
    );
    const EMPTY_ARRAY_LENGTH = 0;
    const IS_EMPTY_ARRAY =
      Array.isArray(value) && value.length === EMPTY_ARRAY_LENGTH;

    if (
      !paramInfo ||
      value === null ||
      IS_EMPTY_ARRAY ||
      value === String(paramInfo.getDefaultValue())
    ) {
      return true;
    }

    return !paramInfo.isValid(value);
  }

  public static getInstance(): PageParamsManager {
    if (!PageParamsManager.instance) {
      PageParamsManager.instance = new PageParamsManager();
    }
    return PageParamsManager.instance;
  }

  public shouldResetPage(newParams: PageParams): boolean {
    const paramsToCheck = Object.values(this.PARAMS)
      .filter((value) => value.shouldResetPage)
      .map((value) => value.urlParam);

    return paramsToCheck.some((key) => key in newParams);
  }

  public getParsedParams(searchParams: URLSearchParams): Required<PageParams> {
    const paramKeys = Object.keys(this.PARAMS) as (keyof typeof this.PARAMS)[];

    return paramKeys.reduce((acc, key) => {
      const { urlParam, getDefaultValue } = this.PARAMS[key];
      const defaultValue = getDefaultValue();
      const value = searchParams.get(urlParam);

      if (Array.isArray(defaultValue)) {
        return {
          ...acc,
          [this.PARAMS[key].urlParam]: value ? value.split(",") : defaultValue,
        };
      }

      if (typeof defaultValue === "number") {
        return {
          ...acc,
          [this.PARAMS[key].urlParam]: value
            ? parseInt(value, 10)
            : defaultValue,
        };
      }

      return {
        ...acc,
        [this.PARAMS[key].urlParam]: value || defaultValue,
      };
    }, {} as Required<PageParams>);
  }

  public sanitizeSearchParams(params: URLSearchParams): URLSearchParams {
    const newParams = new URLSearchParams(params);

    Array.from(newParams.keys()).forEach((key: string) => {
      const value = newParams.get(key);

      if (this.shouldDeleteParam(key, value)) {
        newParams.delete(key);
      }
    });

    return newParams;
  }

  public setDynamicAllowedValues(
    paramKey: keyof PageParams,
    values: string[],
  ): void {
    this.dynamicAllowedValues.set(paramKey, new Set(values));
  }

  public getCurrentPageParam(): string {
    return this.PARAMS.CURRENT_PAGE.urlParam;
  }
}

export default PageParamsManager;
