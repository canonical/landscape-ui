import usePageParams from "@/hooks/usePageParams";
import type { PaginatedGetHookParams } from "@/types/api/PaginatedGetHookParams";
import type { GetActivitiesParams } from "../types";

const useActivitiesQueryParams = (
  params?: GetActivitiesParams,
  config?: PaginatedGetHookParams,
  excludeType?: boolean,
) => {
  const {
    query,
    search,
    status,
    fromDate,
    toDate,
    type,
    currentPage,
    pageSize,
  } = usePageParams();

  const queryParts: string[] = [];

  if (params?.query) {
    queryParts.push(params.query);
  }

  if (search) {
    queryParts.push(search);
  }

  if (query) {
    queryParts.push(query);
  }

  if (status) {
    queryParts.push(`status:${status}`);
  }

  if (fromDate) {
    queryParts.push(`created-after:${fromDate}`);
  }

  if (toDate) {
    queryParts.push(`created-before:${toDate}`);
  }

  if (type && !excludeType) {
    queryParts.push(`type:${type}`);
  }

  return (config?.listenToUrlParams ?? true)
    ? {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        ...params,
        query: queryParts.join(" ") || undefined,
      }
    : params;
};

export default useActivitiesQueryParams;
