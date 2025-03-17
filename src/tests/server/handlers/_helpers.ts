import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import type { HttpHandler } from "msw";
import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";

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
      if (value && value.toString().includes(search)) {
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

  if (search && searchFields) {
    results = generateFilteredResponse(results, search, searchFields);
  }

  if (undefined !== offset && limit) {
    results = results.slice(offset, offset + limit);
  }

  return {
    results,
    count: data.length,
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

interface GenerateGetListEndpointParams<T> {
  readonly path: string;
  readonly response: T[];
}

export function generateGetListEndpoint<T>({
  path,
  response,
}: GenerateGetListEndpointParams<T>): HttpHandler {
  return http.get<never, never, ApiPaginatedResponse<T>>(
    `${API_URL}${path}`,
    () => {
      const endpointStatus = getEndpointStatus();

      if (
        !endpointStatus.path ||
        (endpointStatus.path && endpointStatus.path !== path)
      ) {
        if (endpointStatus.status === "error") {
          throw new HttpResponse(null, { status: 500 });
        }

        if (endpointStatus.status === "empty") {
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
    },
  );
}
