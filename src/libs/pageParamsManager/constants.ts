import moment from "moment";
import { PAGE_SIZE_OPTIONS } from "@/components/layout/TablePagination/components/TablePaginationBase/constants";
import { DAYS_FILTER_OPTIONS } from "@/features/events-log";
import type { ParamsConfig } from "./types";

export const DEFAULT_CURRENT_PAGE = 1;
export const DEFAULT_DAY_INDEX = 1;
export const DEFAULT_EMPTY_ARRAY = [];
export const DEFAULT_EMPTY_STRING = "";
export const DEFAULT_PAGE_SIZE_INDEX = 0;

const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[DEFAULT_PAGE_SIZE_INDEX].value;
const DEFAULT_DAYS = DAYS_FILTER_OPTIONS[DEFAULT_DAY_INDEX].value;

export const PARAMS_CONFIG: ParamsConfig = [
  {
    urlParam: "accessGroups",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_ARRAY,
    isArray: true,
  },
  {
    urlParam: "availabilityZones",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_ARRAY,
    isArray: true,
  },
  {
    urlParam: "currentPage",
    shouldResetPage: false,
    defaultValue: DEFAULT_CURRENT_PAGE,
    isArray: false,
  },
  {
    urlParam: "days",
    shouldResetPage: true,
    defaultValue: DEFAULT_DAYS,
    isArray: false,
  },
  {
    urlParam: "disabledColumns",
    shouldResetPage: false,
    defaultValue: DEFAULT_EMPTY_ARRAY,
    isArray: true,
  },
  {
    urlParam: "fromDate",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
    isArray: false,
    validator: (val: string) => moment(val, moment.ISO_8601, true).isValid(),
  },
  {
    urlParam: "groupBy",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
    isArray: false,
  },
  {
    urlParam: "os",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
    isArray: false,
  },
  {
    urlParam: "pageSize",
    shouldResetPage: true,
    defaultValue: DEFAULT_PAGE_SIZE,
    isArray: false,
  },
  {
    urlParam: "search",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
    isArray: false,
  },
  {
    urlParam: "sort",
    shouldResetPage: false,
    defaultValue: null,
    isArray: false,
    validator: (val: string) => val === "asc" || val === "desc" || val === null,
  },
  {
    urlParam: "sortBy",
    shouldResetPage: false,
    defaultValue: DEFAULT_EMPTY_STRING,
    isArray: false,
  },
  {
    urlParam: "status",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
    isArray: false,
  },
  {
    urlParam: "tab",
    shouldResetPage: false,
    defaultValue: DEFAULT_EMPTY_STRING,
    isArray: false,
  },
  {
    urlParam: "tags",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_ARRAY,
    isArray: true,
  },
  {
    urlParam: "toDate",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
    isArray: false,
    validator: (val: string) => moment(val, moment.ISO_8601, true).isValid(),
  },
  {
    urlParam: "type",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
    isArray: false,
  },
  {
    urlParam: "query",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
    isArray: false,
  },
];
