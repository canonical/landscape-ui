import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import type {
  QueryFnType,
  QueryFnTypeWithRequiredParam,
} from "@/types/QueryFnType";
import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AutoinstallFile } from "../types";

interface AddAutoinstallFileParams {
  filename: string;
  contents: string;
}

interface GetAutoinstallFileParams {
  id: number;
  version?: number;
  with_groups?: boolean;
  with_versions?: boolean;
}

interface GetAutoinstallFilesParams {
  with_groups: boolean;
}

interface UpdateAutoinstallFileParams {
  contents: string;
  id: number;
}

interface UseAutoinstallFilesResult {
  addAutoinstallFileQuery: UseMutationResult<
    AutoinstallFile,
    AxiosError<ApiError>,
    AddAutoinstallFileParams
  >;
  getAutoinstallFileQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<AutoinstallFile>,
    GetAutoinstallFileParams
  >;
  getAutoinstallFilesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<AutoinstallFile>>,
    GetAutoinstallFilesParams
  >;
  updateAutoinstallFileQuery: UseMutationResult<
    AutoinstallFile,
    AxiosError<ApiError>,
    UpdateAutoinstallFileParams
  >;
}

export default function useAutoinstallFiles(): UseAutoinstallFilesResult {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const addAutoinstallFileQuery = useMutation<
    AutoinstallFile,
    AxiosError<ApiError>,
    AddAutoinstallFileParams
  >({
    mutationFn: (params) => authFetch.post("autoinstall", params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["autoinstallFiles"] }),
  });

  const getAutoinstallFileQuery: QueryFnTypeWithRequiredParam<
    AxiosResponse<AutoinstallFile>,
    GetAutoinstallFileParams
  > = ({ id, ...queryParams }, config = {}) =>
    useQuery<AxiosResponse<AutoinstallFile>, AxiosError<ApiError>>({
      queryKey: ["autoinstallFile", { id, ...queryParams }],
      queryFn: () =>
        authFetch.get(`autoinstall/${id}`, {
          params: queryParams,
        }),
      ...config,
    });

  const getAutoinstallFilesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<AutoinstallFile>>,
    GetAutoinstallFilesParams
  > = (queryParams = { with_groups: false }, config = {}) =>
    useQuery<
      AxiosResponse<ApiPaginatedResponse<AutoinstallFile>>,
      AxiosError<ApiError>
    >({
      queryKey: ["autoinstallFiles", queryParams],
      queryFn: () =>
        authFetch.get("autoinstall", {
          params: queryParams,
        }),
      ...config,
    });

  const updateAutoinstallFileQuery = useMutation<
    AutoinstallFile,
    AxiosError<ApiError>,
    UpdateAutoinstallFileParams
  >({
    mutationFn: ({ id, ...params }) =>
      authFetch.patch(`autoinstall/${id}`, params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["autoinstallFiles"] }),
  });

  return {
    addAutoinstallFileQuery,
    getAutoinstallFileQuery,
    getAutoinstallFilesQuery,
    updateAutoinstallFileQuery,
  };
}
