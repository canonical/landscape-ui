import { dynamicAllowedValues, PARAMS } from "./constants";
import type { PageParams, SortDirection } from "./types";

const shouldDeleteParam = (
  key: string,
  value: string | string[] | number | number[] | null,
): boolean => {
  const paramInfo = Object.values(PARAMS).find(
    (param) => param.urlParam === key,
  );

  if (
    value === "" ||
    value === null ||
    (Array.isArray(value) && value.length === 0) ||
    !paramInfo ||
    value === String(paramInfo.getDefaultValue())
  ) {
    return true;
  }

  return !paramInfo.validate(value as string);
};

export const shouldResetPage = (newParams: Record<string, unknown>) => {
  const paramsToCheck = Object.values(PARAMS)
    .filter((value) => value.shouldResetPage)
    .map((value) => value.urlParam);

  return paramsToCheck.some((key) => key in newParams);
};

export const getParsedParams = (
  searchParams: URLSearchParams,
): Required<PageParams> => {
  const paramKeys = Object.keys(PARAMS) as (keyof typeof PARAMS)[];

  return paramKeys.reduce((acc, key) => {
    const { urlParam, getDefaultValue } = PARAMS[key];

    const defaultValue = getDefaultValue();

    const value = searchParams.get(urlParam);

    if (Array.isArray(defaultValue)) {
      return {
        ...acc,
        [PARAMS[key].urlParam]: value ? value.split(",") : defaultValue,
      };
    }

    if (typeof defaultValue === "number") {
      return {
        ...acc,
        [PARAMS[key].urlParam]: value ? parseInt(value, 10) : defaultValue,
      };
    }

    return {
      ...acc,
      [PARAMS[key].urlParam]: value || defaultValue,
    };
  }, {} as Required<PageParams>);
};

export const sanitizeSearchParams = (params: URLSearchParams) => {
  const newParams = new URLSearchParams(params);

  Array.from(newParams.keys()).forEach((key) => {
    const value = newParams.get(key);

    if (shouldDeleteParam(key, value)) {
      newParams.delete(key);
    }
  });

  return newParams;
};

export const validateParam = (param: string, value: string): boolean => {
  const allowed = dynamicAllowedValues.get(param);

  return !allowed || allowed.has(value) || allowed.has(Number(value));
};

export const validateArrayParam = (param: string, value: string): boolean => {
  const allowed = dynamicAllowedValues.get(param);
  return !allowed || value.split(",").every((v) => allowed.has(v));
};

export const setDynamicAllowedValues = (paramKey: string, values: string[]) => {
  dynamicAllowedValues.set(paramKey, new Set(values));
};

export const getDefaultArray = (): string[] => {
  return [];
};

export const getDefaultString = (): string => {
  return "";
};

export const getDefaultSortDirection = (): SortDirection | null => {
  return null;
};
