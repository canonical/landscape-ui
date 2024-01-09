import useFetchOld from "./useFetchOld";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { APTSource } from "../types/APTSource";
import useDebug from "./useDebug";
import { AxiosError, AxiosResponse } from "axios";
import { QueryFnType } from "../types/QueryFnType";
import { ApiError } from "../types/ApiError";

interface GetAPTSourcesParams {
  names?: string[];
}

interface CreateAPTSourceParams {
  name: string;
  apt_line: string;
  gpg_key?: string;
  access_group?: string;
}

interface RemoveAPTSourceParams {
  name: string;
}

interface UseAPTSourcesResult {
  getAPTSourcesQuery: QueryFnType<
    AxiosResponse<APTSource[]>,
    GetAPTSourcesParams
  >;
  createAPTSourceQuery: UseMutationResult<
    AxiosResponse<APTSource>,
    AxiosError<ApiError>,
    CreateAPTSourceParams
  >;
  removeAPTSourceQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveAPTSourceParams
  >;
}

export default function useAPTSources(): UseAPTSourcesResult {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();
  const debug = useDebug();

  const getAPTSourcesQuery: QueryFnType<
    AxiosResponse<APTSource[]>,
    GetAPTSourcesParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<APTSource[]>, AxiosError<ApiError>>({
      queryKey: ["aptSources"],
      queryFn: () =>
        authFetch!.get("GetAPTSources", {
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
    mutationFn: (params) => authFetch!.get("CreateAPTSource", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["aptSources"]).catch(debug);
    },
  });

  const removeAPTSourceQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveAPTSourceParams
  >({
    mutationKey: ["aptSources", "remove"],
    mutationFn: (params) => authFetch!.get("RemoveAPTSource", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["aptSources"]).catch(debug);
    },
  });

  return { getAPTSourcesQuery, createAPTSourceQuery, removeAPTSourceQuery };
}
