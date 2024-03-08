import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";

interface GeneratePaginatedResponseProps<D> {
  data: D[];
  search?: string;
  searchFields?: string[];
  limit?: number;
  offset?: number;
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
    results = results.filter((item) => {
      for (const field of searchFields) {
        // @ts-ignore
        if (item[field].includes(search)) {
          return true;
        }
      }

      return false;
    });
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
