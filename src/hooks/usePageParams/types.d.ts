import type PageParamsManager from "./PageParamsManager";

type ParamsType = (typeof PageParamsManager.prototype)["PARAMS"];

type ParamKeyMapping<T> = {
  [K in keyof T as T[K]["urlParam"]]: ReturnType<T[K]["getDefaultValue"]>;
};

type PossibleDefaultValues = string | number | string[] | null;

interface ParamConfig {
  readonly urlParam: string;
  readonly shouldResetPage: boolean;
  readonly getDefaultValue: () => PossibleDefaultValues;
  readonly isValid: (value: string) => boolean;
}

export type SortDirection = "asc" | "desc";
export type PageParams = Partial<ParamKeyMapping<ParamsType>>;
export type ParamsConfig = Record<string, ParamConfig>;

export type UsePageParamsReturnType = ParamKeyMapping<ParamsType> & {
  setPageParams: (newParams: PageParams) => void;
};
