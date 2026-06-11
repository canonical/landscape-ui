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

  const parts: string[] = [];

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value == null) {
      return;
    }

    if (Array.isArray(value)) {
      // Comma-join array-typed params (`healthBand`, `tags`, `accessGroups`,
      // …) — `pageParamsManager` reads them with `searchParams.get(key)`
      // followed by `.split(",")`, so a multi-param URL
      // (`?healthBand=critical&healthBand=warning`) collapses to just the
      // first value when the page parses it. Comma-joining keeps deep links
      // round-trippable. We assemble the query string by hand here because
      // `URLSearchParams` would percent-encode the comma (`%2C`); the
      // pageParamsManager handles either form, but the literal-comma URL is
      // what callers asked for and reads better in address bars / logs.
      const items = value.filter((item) => item != null).map(String);
      if (items.length > 0) {
        parts.push(
          `${encodeURIComponent(key)}=${items.map(encodeURIComponent).join(",")}`,
        );
      }
    } else {
      parts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      );
    }
  });

  if (parts.length === 0) {
    return resolvedPath;
  }
  return `${resolvedPath}?${parts.join("&")}`;
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
