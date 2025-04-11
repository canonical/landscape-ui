import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { QueryFnType } from "@/types/QueryFnType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  CreateAPTSourceParams,
  GetAPTSourcesParams,
  RemoveAPTSourceParams,
  APTSource,
} from "../types";

export default function useAPTSources() {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();

  const getAPTSourcesQuery: QueryFnType<
    AxiosResponse<APTSource[]>,
    GetAPTSourcesParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<APTSource[]>, AxiosError<ApiError>>({
      queryKey: ["aptSources"],
      queryFn: () =>
        authFetch.get("GetAPTSources", {
          params: queryParams,
        }),
      ...config,
    });

  const createAPTSourceQuery = useMutation<
    AxiosResponse<APTSource>,
    AxiosError<ApiError>,
    CreateAPTSourceParams
  >({
    mutationKey: ["aptSources", "new"],
    mutationFn: (params) => authFetch.get("CreateAPTSource", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["aptSources"] }),
  });

  const removeAPTSourceQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveAPTSourceParams
  >({
    mutationKey: ["aptSources", "remove"],
    mutationFn: (params) => authFetch.get("RemoveAPTSource", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["aptSources"] }),
  });

  return { getAPTSourcesQuery, createAPTSourceQuery, removeAPTSourceQuery };
}
