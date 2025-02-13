/**
 * A "SortDirection" type to reflect the valid sort states.
 */
export type SortDirection = "asc" | "desc" | null;

/**
 * The "PageParams" structure that your application expects.
 * Make sure this matches all your usage elsewhere.
 */
export interface PageParams {
  accessGroups: string[];
  availabilityZones: string[];
  currentPage: number;
  days: string;
  disabledColumns: string[];
  fromDate: string;
  groupBy: string;
  os: string;
  pageSize: number;
  search: string;
  sort: SortDirection;
  sortBy: string;
  status: string;
  tab: string;
  tags: string[];
  toDate: string;
  type: string;
  query: string;
}

/**
 * A definition for each parameter:
 * - urlParam: the key in URLSearchParams
 * - shouldResetPage: whether changing it forces a "page" reset
 * - defaultValue: the default value if not present or invalid
 * - isArray: whether the param is parsed as an array or a single value
 * - validator: optional function to check if a given (string) value is valid
 */
export interface ParamDefinition {
  urlParam: keyof PageParams;
  shouldResetPage: boolean;
  defaultValue: number | string | string[] | null;
  isArray: boolean;
  validator?: (value: string) => boolean;
}

export type ParamsConfig = ParamDefinition[];
