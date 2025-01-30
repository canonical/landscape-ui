import type { PARAMS } from "./constants";

export type SortDirection = "asc" | "desc";

type ParamValue = string | string[] | number | number[];

type ArrayParams = Record<
  | typeof PARAMS.ACCESS_GROUPS
  | typeof PARAMS.AVAILABILITY_ZONES
  | typeof PARAMS.DISABLED_COLUMNS
  | typeof PARAMS.TAGS,
  readonly string[]
>;

type NumberParams = Record<
  typeof PARAMS.CURRENT_PAGE | typeof PARAMS.PAGE_SIZE | typeof PARAMS.DAYS,
  number
>;

type SortParams = Record<typeof PARAMS.SORT, SortDirection | null>;

type StringParams = Record<
  Exclude<
    (typeof PARAMS)[keyof typeof PARAMS],
    keyof ArrayParams | keyof NumberParams | keyof SortParams
  >,
  string
>;

type PageParams = Partial<
  ArrayParams & NumberParams & SortParams & StringParams
>;
