import type { PageParams } from "../pageParamsManager";

type QueryParamTypes = PageParams[keyof PageParams];

const replacePath = <T extends Record<string, string>>(
  path: string,
  pathParams: T,
): string => {
  let result = path;
  Object.entries(pathParams).forEach(([key, value]) => {
    result = result.replace(`:${key}`, encodeURIComponent(String(value)));
  });
  return result;
};

const buildUrl = <T extends Record<string, string>>(
  path: string,
  pathParams: T,
  queryParams?: Record<string, QueryParamTypes>,
): string => {
  const resolvedPath = replacePath(path, pathParams);

  if (!queryParams) {
    return resolvedPath;
  }

  const qs = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        qs.append(key, item);
      });
    } else {
      qs.append(key, String(value));
    }
  });

  if (qs.toString()) {
    return `${resolvedPath}?${qs.toString()}`;
  }

  return resolvedPath;
};

export const createRoute = (path: string) => (params?: Partial<PageParams>) =>
  buildUrl(path, {}, params);

export const createRouteWithParams =
  <T extends Record<string, string>>(path: string) =>
  (pathParams: T, queryParams?: Partial<PageParams>) =>
    buildUrl(path, pathParams, queryParams);

export const createCustomRoute =
  (path: string) => (params?: Record<string, string | string[]>) =>
    buildUrl(path, {}, params);
