import { PARAMS } from "./constants";

export type SortDirection = "asc" | "desc";

type ParamValue = string | string[] | number | number[];

type ArrayParams = {
  [K in
    | typeof PARAMS.ACCESS_GROUPS
    | typeof PARAMS.AVAILABILITY_ZONES
    | typeof PARAMS.DISABLED_COLUMNS
    | typeof PARAMS.TAGS]: string[];
};

type NumberParams = {
  [K in
    | typeof PARAMS.CURRENT_PAGE
    | typeof PARAMS.PAGE_SIZE
    | typeof PARAMS.DAYS]: number;
};

type SortParams = {
  [K in typeof PARAMS.SORT]: SortDirection | null;
};

type StringParams = {
  [K in Exclude<
    (typeof PARAMS)[keyof typeof PARAMS],
    keyof ArrayParams | keyof NumberParams | keyof SortParams
  >]: string;
};

type PageParams = Partial<
  ArrayParams & NumberParams & SortParams & StringParams
>;
