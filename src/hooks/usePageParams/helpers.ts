import { ALLOWED_DAY_OPTIONS, ALLOWED_PAGE_SIZES, PARAMS } from "./constants";
import type { PageParams } from "./types";

export const modifyUrlParameters = (
  params: URLSearchParams,
  key: string,
  value: string | string[] | number | number[] | null,
) => {
  if (
    value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    value === null
  ) {
    params.delete(key);
  } else {
    params.set(key, String(value));
  }
};

export const shouldResetPage = (newParams: Record<string, unknown>) => {
  const paramsToCheck = [
    PARAMS.ACCESS_GROUPS,
    PARAMS.AVAILABILITY_ZONES,
    PARAMS.DAYS,
    PARAMS.FROM_DATE,
    PARAMS.GROUP_BY,
    PARAMS.OS,
    PARAMS.PAGE_SIZE,
    PARAMS.SEARCH,
    PARAMS.STATUS,
    PARAMS.TAGS,
    PARAMS.TO_DATE,
    PARAMS.TYPE,
  ];

  return paramsToCheck.some((key) => key in newParams);
};

const parseParamValue = (key: keyof typeof PARAMS, value: string | null) => {
  switch (PARAMS[key]) {
    case PARAMS.CURRENT_PAGE:
      return Number(value ?? "1");

    case PARAMS.PAGE_SIZE:
      return ALLOWED_PAGE_SIZES.includes(Number(value))
        ? Number(value)
        : ALLOWED_PAGE_SIZES[0];

    case PARAMS.DAYS:
      return ALLOWED_DAY_OPTIONS.includes(Number(value)) ? Number(value) : 7;

    case PARAMS.ACCESS_GROUPS:
    case PARAMS.AVAILABILITY_ZONES:
    case PARAMS.DISABLED_COLUMNS:
    case PARAMS.TAGS:
      return value?.split(",").filter(Boolean) ?? [];

    default:
      return value || "";
  }
};

export const getParsedParams = (
  searchParams: URLSearchParams,
): Required<PageParams> => {
  const paramKeys = Object.keys(PARAMS) as (keyof typeof PARAMS)[];

  const pageParams = paramKeys.reduce((acc, key) => {
    const value = searchParams.get(PARAMS[key]);

    return {
      ...acc,
      [PARAMS[key]]: parseParamValue(key, value),
    };
  }, {} as Required<PageParams>);

  return pageParams;
};
