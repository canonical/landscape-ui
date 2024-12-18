import moment from "moment";
import { PAGE_SIZE_OPTIONS } from "@/components/layout/TablePagination/components/TablePaginationBase/constants";
import { DAYS_FILTER_OPTIONS } from "@/features/events-log";
import {
  getDefaultArray,
  getDefaultSortDirection,
  getDefaultString,
  validateArrayParam,
  validateParam,
} from "./helpers";
import type { PossibleDefaultValues } from "./types";

export const dynamicAllowedValues = new Map<string, Set<unknown>>();

const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0].value;
const DEFAULT_DAY = DAYS_FILTER_OPTIONS[1].value;

interface ParamConfig {
  readonly urlParam: string;
  readonly shouldResetPage: boolean;
  readonly getDefaultValue: () => PossibleDefaultValues;
  readonly validate: (value: string) => boolean;
}

export const PARAMS = {
  ACCESS_GROUPS: {
    urlParam: "accessGroups" as const,
    shouldResetPage: true,
    getDefaultValue: getDefaultArray,
    validate: (value) => validateArrayParam("accessGroups", value),
  },
  AVAILABILITY_ZONES: {
    urlParam: "availabilityZones" as const,
    shouldResetPage: true,
    getDefaultValue: getDefaultArray,
    validate: (value) => validateArrayParam("availabilityZones", value),
  },
  CURRENT_PAGE: {
    urlParam: "currentPage" as const,
    shouldResetPage: false,
    getDefaultValue: () => 1,
    validate: (value) => validateParam("currentPage", value),
  },
  DAYS: {
    urlParam: "days" as const,
    shouldResetPage: true,
    getDefaultValue: () => DEFAULT_DAY,
    validate: (value) => validateParam("days", value),
  },
  DISABLED_COLUMNS: {
    urlParam: "disabledColumns" as const,
    shouldResetPage: false,
    getDefaultValue: getDefaultArray,
    validate: (value) => validateArrayParam("disabledColumns", value),
  },
  EMPLOYEE_GROUPS: {
    urlParam: "employeeGroups" as const,
    shouldResetPage: true,
    getDefaultValue: getDefaultArray,
    validate: (value) => validateArrayParam("employeeGroups", value),
  },
  FROM_DATE: {
    urlParam: "fromDate" as const,
    shouldResetPage: true,
    getDefaultValue: getDefaultString,
    validate: (value) => moment(value, moment.ISO_8601, true).isValid(),
  },
  GROUP_BY: {
    urlParam: "groupBy" as const,
    shouldResetPage: true,
    getDefaultValue: getDefaultString,
    validate: (value) => validateParam("groupBy", value),
  },
  OS: {
    urlParam: "os" as const,
    shouldResetPage: true,
    getDefaultValue: getDefaultString,
    validate: (value) => validateParam("os", value),
  },
  PAGE_SIZE: {
    urlParam: "pageSize" as const,
    shouldResetPage: true,
    getDefaultValue: () => DEFAULT_PAGE_SIZE,
    validate: (value) => validateParam("pageSize", value),
  },
  SEARCH: {
    urlParam: "search" as const,
    shouldResetPage: true,
    getDefaultValue: getDefaultString,
    validate: () => true,
  },
  SORT: {
    urlParam: "sort" as const,
    shouldResetPage: false,
    getDefaultValue: getDefaultSortDirection,
    validate: (value) => value === "asc" || value === "desc" || value === null,
  },
  SORT_BY: {
    urlParam: "sortBy" as const,
    shouldResetPage: false,
    getDefaultValue: getDefaultString,
    validate: (value) => validateParam("sortBy", value),
  },
  STATUS: {
    urlParam: "status" as const,
    shouldResetPage: true,
    getDefaultValue: getDefaultString,
    validate: (value) => validateParam("status", value),
  },
  TAB: {
    urlParam: "tab" as const,
    shouldResetPage: false,
    getDefaultValue: getDefaultString,
    validate: () => true,
  },
  TAGS: {
    urlParam: "tags" as const,
    shouldResetPage: true,
    getDefaultValue: getDefaultArray,
    validate: (value) => validateArrayParam("tags", value),
  },
  TO_DATE: {
    urlParam: "toDate" as const,
    shouldResetPage: true,
    getDefaultValue: getDefaultString,
    validate: (value) => moment(value, moment.ISO_8601, true).isValid(),
  },
  TYPE: {
    urlParam: "type" as const,
    shouldResetPage: true,
    getDefaultValue: getDefaultString,
    validate: (value) => validateParam("type", value),
  },
  QUERY: {
    urlParam: "query" as const,
    shouldResetPage: true,
    getDefaultValue: getDefaultString,
    validate: () => true,
  },
} as const satisfies Record<string, ParamConfig>;
