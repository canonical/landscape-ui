import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { QueryFnType } from "@/types/api/QueryFnType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  AvailableSnap,
  AvailableSnapInfo,
  GetAvailableSnapInfoParams,
  GetAvailableSnapsParams,
  GetSnapsParams,
  InstalledSnap,
  SnapActionParams,
} from "../types";

const useSnaps = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const getSnapsQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<InstalledSnap>>,
    GetSnapsParams
  > = (queryParams, config = {}) => {
    if (!queryParams) {
      throw new Error("Missing required parameters");
    }

    const { instance_id, ...params } = queryParams;

    return useQuery<
      AxiosResponse<ApiPaginatedResponse<InstalledSnap>>,
      AxiosError<ApiError>
    >({
      queryKey: ["snaps", { ...queryParams }],
      queryFn: async () =>
        authFetch.get(`computers/${instance_id}/snaps/installed`, {
          params: params,
        }),
      ...config,
    });
  };

  const getAvailableSnaps: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<AvailableSnap>>,
    GetAvailableSnapsParams
  > = (queryParams, config = {}) =>
    useQuery<
      AxiosResponse<ApiPaginatedResponse<AvailableSnap>>,
      AxiosError<ApiError>
    >({
      queryKey: ["snaps", { ...queryParams }],
      queryFn: async () => {
        if (!queryParams) {
          throw new Error("Missing required parameters");
        }

        return authFetch.get(
          `computers/${queryParams.instance_id}/snaps/available?name_startswith=${queryParams.query}`,
        );
      },
      ...config,
    });

  const getAvailableSnapInfo: QueryFnType<
    AxiosResponse<AvailableSnapInfo>,
    GetAvailableSnapInfoParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<AvailableSnapInfo>, AxiosError<ApiError>>({
      queryKey: ["snaps", { ...queryParams }],
      queryFn: async () => {
        if (!queryParams) {
          throw new Error("Missing required parameters");
        }

        return authFetch.get(
          `computers/${queryParams.instance_id}/snaps/${queryParams.name}/info`,
        );
      },
      ...config,
    });

  const snapsActionQuery = useMutation<
    AxiosResponse<InstalledSnap>,
    AxiosError<ApiError>,
    SnapActionParams
  >({
    mutationKey: ["snaps", "action"],
    mutationFn: async (params) => authFetch.post("snaps", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["snaps"] }),
  });

  return {
    getSnapsQuery,
    getAvailableSnapInfo,
    getAvailableSnaps,
    snapsActionQuery,
  };
};

export default useSnaps;
