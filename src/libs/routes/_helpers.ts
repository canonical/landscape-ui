import type { PageParams } from "../pageParamsManager";

type PathParamValue = string | number;

const replacePath = <T extends Record<string, PathParamValue>>(
  path: string,
  pathParams: T,
): string => {
  let result = path;
  Object.entries(pathParams).forEach(([key, value]) => {
    result = result.replace(`:${key}`, encodeURIComponent(String(value)));
  });
  return result;
};

const buildUrl = <T extends Record<string, PathParamValue>>(
  path: string,
  pathParams: T,
  queryParams?: Partial<PageParams>,
): string => {
  const resolvedPath = replacePath(path, pathParams);

  if (!queryParams) {
    return resolvedPath;
  }

  const qs = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value == null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item == null) {
          return;
        }

        qs.append(key, String(item));
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
  <T extends Record<string, PathParamValue>>(path: string) =>
  (pathParams: T, queryParams?: Partial<PageParams>) =>
    buildUrl(path, pathParams, queryParams);

export const createCustomRoute =
  <T extends Record<string, string | number | boolean>>(path: string) =>
  (params?: T): string => {
    if (!params || Object.keys(params).length === 0) {
      return path;
    }

    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();

    return query ? `${path}?${query}` : path;
  };

export const createPathBuilder = (basePath: string) => {
  return (childPath: string): string => `${basePath}/${childPath}`;
};
