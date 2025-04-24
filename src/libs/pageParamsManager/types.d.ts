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
  autoinstallFiles: string[];
  availabilityZones: string[];
  currentPage: number;
  days: string;
  disabledColumns: string[];
  fromDate: string;
  groupBy: string;
  os: string;
  pageSize: number;
  parent: number | undefined;
  search: string;
  sort: SortDirection;
  sortBy: string;
  status: string;
  tab: string;
  tags: string[];
  toDate: string;
  passRateTo: number;
  passRateFrom: number;
  type: string;
  query: string;
  employeeGroups: string[];
}

/**
 * A definition for each parameter:
 * - urlParam: the key in URLSearchParams
 * - shouldResetPage: whether changing it forces a "page" reset
 * - defaultValue: the default value if not present or invalid
 * - isArray: whether the param is parsed as an array or a single value
 * - validator: optional function to check if a given (string) value is valid
 */
export interface ParamDefinition<T extends keyof PageParams> {
  urlParam: T;
  shouldResetPage: boolean;
  defaultValue: PageParams[T];
  validator?: (value: string) => boolean;
}

/**
 * Configuration array for URL search parameters.
 * Each entry defines how a PageParams property should be handled,
 * including its default value, validation, and pagination behavior.
 */
export type ParamsConfig = {
  [K in keyof PageParams]: ParamDefinition<K>;
}[keyof PageParams][];
