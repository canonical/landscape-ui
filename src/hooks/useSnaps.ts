import { ApiError } from "@/types/ApiError";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { QueryFnType } from "@/types/QueryFnType";
import { AvailableSnap, AvailableSnapInfo, InstalledSnap } from "@/types/Snap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import useFetch from "./useFetch";

interface AffectedSnap {
  name: string;
  channel?: string;
  revision?: string;
  time?: string;
}

export interface SnapActionParams {
  action: string;
  computer_ids: number[];
  snaps: AffectedSnap[];
  deliver_after?: string;
  deliver_after_window?: number;
}

export interface GetSnapsParams {
  instance_id: number;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface GetAvailableSnapsParams {
  instance_id: number;
  query: string;
}

interface GetAvailableSnapInfoParams {
  instance_id: number;
  name: string;
}

export const useSnaps = () => {
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
      queryFn: () =>
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
      queryFn: () => {
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
      queryFn: () => {
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
    mutationFn: (params) => authFetch.post("snaps", params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["snaps"] }),
  });

  return {
    getSnapsQuery,
    getAvailableSnapInfo,
    getAvailableSnaps,
    snapsActionQuery,
  };
};
