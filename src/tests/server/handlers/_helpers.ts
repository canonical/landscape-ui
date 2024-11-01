import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";

interface GeneratePaginatedResponseProps<D> {
  data: D[];
  limit: number | undefined;
  offset: number | undefined;
  search?: string;
  searchFields?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedProperty(obj: any, path: string) {
  return path.split(".").reduce((obj, key) => obj && obj[key], obj);
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

export const isAction = (request: Request, actionName: string | string[]) => {
  const url = new URL(request.url);
  const action = url.searchParams.get("action") ?? "";

  return "string" === typeof actionName
    ? action === actionName
    : actionName.includes(action);
};
