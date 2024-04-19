import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";

interface GeneratePaginatedResponseProps<D> {
  data: D[];
  search?: string;
  searchFields?: string[];
  limit?: number;
  offset?: number;
}

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

  if (offset && limit) {
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
