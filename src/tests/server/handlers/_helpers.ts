import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { HttpHandler } from "msw";
import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { createEndpointStatusNetworkError } from "./_constants";

interface GeneratePaginatedResponseProps<D> {
  data: D[];
  limit: number | undefined;
  offset: number | undefined;
  search?: string;
  searchFields?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedProperty(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => acc && acc[key], obj);
}

export function generateFilteredResponse<D>(
  data: D[],
  search: string,
  searchFields: string[],
): D[] {
  return data.filter((item) => {
    for (const field of searchFields) {
      const value = getNestedProperty(item, field);
      if (
        value &&
        value.toString().toLowerCase().includes(search.toLowerCase())
      ) {
        return true;
      }
    }

    return false;
  });
}

export function generatePaginatedResponse<D>({
  data,
  offset,
  limit,
  search,
  searchFields,
}: GeneratePaginatedResponseProps<D>): ApiPaginatedResponse<D> {
  let results = data;
  let count = data.length;

  if (search && searchFields) {
    results = generateFilteredResponse(results, search, searchFields);
    count = results.length;
  }

  if (undefined !== offset && limit) {
    results = results.slice(offset, offset + limit);
  }

  return {
    results,
    count,
    next: null,
    previous: null,
  };
}

export const isAction = (request: Request, actionName: string | string[]) => {
  const url = new URL(request.url);
  const action = url.searchParams.get("action") ?? "";

  return "string" === typeof actionName
    ? action === actionName
    : actionName.includes(action);
};

/**
 * Returns `true` when the global endpoint-status controller has a non-default
 * status that applies to the given path.  Pass the handler's own path so that
 * a targeted `setEndpointStatus({ status: "error", path: "/features" })` only
 * affects the matching handler.
 */
export function shouldApplyEndpointStatus(path?: string): boolean {
  const { status, path: statusPath } = getEndpointStatus();
  if (status === "default") return false;
  if (!statusPath) return true;
  return !!path && statusPath.includes(path);
}

interface GenerateGetListEndpointParams<T> {
  readonly path: string;
  readonly response: T[];
}

export function generateGetListEndpoint<T>({
  path,
  response,
}: GenerateGetListEndpointParams<T>): HttpHandler {
  return http.get(`${API_URL}${path}`, () => {
    if (shouldApplyEndpointStatus(path)) {
      const { status } = getEndpointStatus();

      if (status === "error") {
        throw createEndpointStatusNetworkError();
      }

      if (status === "empty") {
        return HttpResponse.json({
          results: [],
          count: 0,
          next: null,
          previous: null,
        });
      }
    }

    return HttpResponse.json({
      results: response,
      count: response.length,
      next: null,
      previous: null,
    });
  });
}

export const parseArray = (paramValue: string | null): string[] => {
  if (!paramValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(paramValue);
    return Array.isArray(parsed) ? parsed : [paramValue];
  } catch {
    const ids = paramValue.split(",").filter((id) => id.trim() !== "");
    return ids.length > 0 ? ids : [];
  }
};

export const getDebArchivePaginationParams = (requestUrl: string) => {
  const { searchParams } = new URL(requestUrl);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);
  const pageToken = parseInt(searchParams.get("pageToken") ?? "0", 10) || 0;

  return {
    pageSize,
    pageToken,
  };
};

export const getDebArchivePaginatedResponse = <
  T extends Record<string, unknown>,
>(
  data: T[],
  pageToken: number,
  pageSize: number,
) => {
  const paginatedData = data.slice(pageToken, pageToken + pageSize);

  const nextPageToken =
    pageToken + pageSize < data.length
      ? String(pageToken + pageSize)
      : undefined;

  return {
    paginatedData,
    nextPageToken,
  };
};
