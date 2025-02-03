import type { PARAMS } from "./constants";

export type SortDirection = "asc" | "desc";

export type ParamKeyMapping = {
  [K in keyof typeof PARAMS as (typeof PARAMS)[K]["urlParam"]]: ReturnType<
    (typeof PARAMS)[K]["getDefaultValue"]
  >;
};

export type PageParams = Partial<ParamKeyMapping>;

export type PossibleDefaultValues = string | number | string[] | null;
