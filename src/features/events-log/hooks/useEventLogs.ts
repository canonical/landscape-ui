import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { QueryFnType } from "@/types/api/QueryFnType";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { EventLog, GetEventsLogParams } from "../types";

export default function useEventsLog() {
  const authFetch = useFetch();

  const getEventsLog: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<EventLog>>,
    GetEventsLogParams
  > = (queryParams, config = {}) => {
    const params = {
      ...queryParams,
      search: queryParams?.search || undefined,
    };
    return useQuery<
      AxiosResponse<ApiPaginatedResponse<EventLog>>,
      AxiosError<ApiError>
    >({
      queryKey: ["events", params],
      queryFn: async () =>
        authFetch.get("events", {
          params,
        }),
      ...config,
    });
  };

  return {
    getEventsLog,
  };
}
