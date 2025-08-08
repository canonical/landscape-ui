import { PAGE_SIZE_OPTIONS } from "@/components/layout/TablePagination/components/TablePaginationBase/constants";
import { DAYS_FILTER_OPTIONS } from "@/features/events-log";
import moment from "moment";
import type { ParamsConfig } from "./types";

const DEFAULT_DAY_INDEX = 1;
const DEFAULT_PAGE_SIZE_INDEX = 0;

export const DEFAULT_CURRENT_PAGE = 1;
export const DEFAULT_EMPTY_ARRAY = [];
export const DEFAULT_NULL_NUMBER = -1;
export const DEFAULT_EMPTY_STRING = "";
export const DEFAULT_PAGE_SIZE =
  PAGE_SIZE_OPTIONS[DEFAULT_PAGE_SIZE_INDEX].value;
export const DEFAULT_DAYS = DAYS_FILTER_OPTIONS[DEFAULT_DAY_INDEX].value;
export const DEFAULT_RATE_FROM = 0;
export const DEFAULT_RATE_TO = 100;

export const PARAMS_CONFIG: ParamsConfig = [
  {
    urlParam: "accessGroups",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_ARRAY,
  },
  {
    urlParam: "availabilityZones",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_ARRAY,
  },
  {
    urlParam: "currentPage",
    shouldResetPage: false,
    defaultValue: DEFAULT_CURRENT_PAGE,
  },
  {
    urlParam: "days",
    shouldResetPage: true,
    defaultValue: DEFAULT_DAYS,
  },
  {
    urlParam: "disabledColumns",
    shouldResetPage: false,
    defaultValue: DEFAULT_EMPTY_ARRAY,
  },
  {
    urlParam: "fromDate",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
    validator: (val: string) => moment(val, moment.ISO_8601, true).isValid(),
  },
  {
    urlParam: "groupBy",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
  },
  {
    urlParam: "os",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
  },
  {
    urlParam: "pageSize",
    shouldResetPage: true,
    defaultValue: DEFAULT_PAGE_SIZE,
  },
  {
    urlParam: "search",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
  },
  {
    urlParam: "sort",
    shouldResetPage: false,
    defaultValue: null,
    validator: (val: string) => val === "asc" || val === "desc" || val === null,
  },
  {
    urlParam: "sortBy",
    shouldResetPage: false,
    defaultValue: DEFAULT_EMPTY_STRING,
  },
  {
    urlParam: "status",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
  },
  {
    urlParam: "tab",
    shouldResetPage: false,
    defaultValue: DEFAULT_EMPTY_STRING,
  },
  {
    urlParam: "tags",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_ARRAY,
  },
  {
    urlParam: "toDate",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
    validator: (val: string) => moment(val, moment.ISO_8601, true).isValid(),
  },
  {
    urlParam: "type",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
  },
  {
    urlParam: "query",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
  },
  {
    urlParam: "passRateFrom",
    shouldResetPage: true,
    defaultValue: DEFAULT_RATE_FROM,
  },
  {
    urlParam: "passRateTo",
    shouldResetPage: true,
    defaultValue: DEFAULT_RATE_TO,
  },
  {
    urlParam: "wsl",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_ARRAY,
  },
  {
    urlParam: "code",
    shouldResetPage: true,
    defaultValue: DEFAULT_EMPTY_STRING,
  },
  {
    urlParam: "action",
    shouldResetPage: false,
    defaultValue: DEFAULT_EMPTY_STRING,
  },
  {
    urlParam: "packageProfile",
    shouldResetPage: false,
    defaultValue: DEFAULT_EMPTY_STRING,
  },
  {
    urlParam: "rebootProfile",
    shouldResetPage: false,
    defaultValue: DEFAULT_NULL_NUMBER,
  },
];
