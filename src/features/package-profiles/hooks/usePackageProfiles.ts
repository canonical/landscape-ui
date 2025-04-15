import type { QueryFnType } from "@/types/QueryFnType";
import type {
  PackageProfile,
  PackageProfileConstraint,
  PackageProfileConstraintType,
} from "../types";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiError } from "@/types/api/ApiError";
import useFetchOld from "@/hooks/useFetchOld";
import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";

interface GetPackageProfilesParams {
  names?: string[];
}

export interface CopyPackageProfileParams {
  copy_from: string;
  access_group?: string;
  all_computers?: boolean;
  description?: string;
  tags?: string[];
  title?: string;
}

export interface CreatePackageProfileParams {
  description: string;
  title: string;
  access_group?: string;
  all_computers?: boolean;
  constraints?: Omit<PackageProfileConstraint, "id">[];
  material?: string;
  source_computer_id?: number;
  tags?: string[];
}

export interface EditPackageProfileParams {
  name: string;
  all_computers?: boolean;
  constraints?: PackageProfileConstraint[];
  description?: string;
  tags?: string[];
  title?: string;
}

interface RemovePackageProfileParams {
  name: string;
}

interface GetInstancePackageProfileParams {
  instanceId: number;
}

interface GetPackageProfileConstraintsParams {
  name: string;
  constraint_type?: PackageProfileConstraintType;
  limit?: number;
  offset?: number;
  search?: string;
}

interface AddPackageProfileConstraintsParams {
  name: string;
  constraints: Omit<PackageProfileConstraint, "id">[];
}

interface EditPackageProfileConstraintParams extends PackageProfileConstraint {
  name: string;
}

interface RemovePackageProfileConstraintsParams {
  name: string;
  constraint_ids: number[];
}

export default function usePackageProfiles() {
  const queryClient = useQueryClient();
  const authFetch = useFetch();
  const authFetchOld = useFetchOld();

  const getPackageProfilesQuery: QueryFnType<
    AxiosResponse<{ result: PackageProfile[] }>,
    GetPackageProfilesParams
  > = (queryParams = {}, config = {}) => {
    return useQuery<
      AxiosResponse<{ result: PackageProfile[] }>,
      AxiosError<ApiError>
    >({
      queryKey: ["packageProfiles", queryParams],
      queryFn: async () =>
        authFetch.get("packageprofiles", { params: queryParams }),
      ...config,
    });
  };

  const copyPackageProfileQuery = useMutation<
    AxiosResponse<PackageProfile>,
    AxiosError<ApiError>,
    CopyPackageProfileParams
  >({
    mutationFn: async (params) => authFetch.post("packageprofiles", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["packageProfiles"] }),
  });

  const createPackageProfileQuery = useMutation<
    AxiosResponse<PackageProfile>,
    AxiosError<ApiError>,
    CreatePackageProfileParams
  >({
    mutationFn: async (params) => authFetch.post("packageprofiles", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["packageProfiles"] }),
  });

  const removePackageProfileQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemovePackageProfileParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("RemovePackageProfile", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["packageProfiles"] }),
  });

  const editPackageProfileQuery = useMutation<
    AxiosResponse<PackageProfile>,
    AxiosError<ApiError>,
    EditPackageProfileParams
  >({
    mutationFn: async ({ name, ...params }) =>
      authFetch.put(`packageprofiles/${name}`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["packageProfiles"] }),
  });

  const getInstancePackageProfileQuery = (
    { instanceId, ...queryParams }: GetInstancePackageProfileParams,
    config: Omit<
      UseQueryOptions<AxiosResponse<PackageProfile[]>, AxiosError<ApiError>>,
      "queryKey" | "queryFn"
    > = {},
  ) =>
    useQuery<AxiosResponse<PackageProfile[]>, AxiosError<ApiError>>({
      queryKey: ["instancePackageProfiles", { instanceId, ...queryParams }],
      queryFn: async () =>
        authFetch.get(`computers/${instanceId}/packages/profile`, {
          params: queryParams,
        }),
      ...config,
    });

  const getPackageProfileConstraintsQuery = (
    { name, ...queryParams }: GetPackageProfileConstraintsParams,
    config: Omit<
      UseQueryOptions<
        AxiosResponse<ApiPaginatedResponse<PackageProfileConstraint>>,
        AxiosError<ApiError>
      >,
      "queryKey" | "queryFn"
    > = {},
  ) =>
    useQuery<
      AxiosResponse<ApiPaginatedResponse<PackageProfileConstraint>>,
      AxiosError<ApiError>
    >({
      queryKey: ["packageProfileConstraints", { name, ...queryParams }],
      queryFn: async () =>
        authFetch.get(`packageprofiles/${name}/constraints`, {
          params: queryParams,
        }),
      ...config,
    });

  const addPackageProfileConstraintsQuery = useMutation<
    AxiosResponse<ApiPaginatedResponse<PackageProfileConstraint>>,
    AxiosError<ApiError>,
    AddPackageProfileConstraintsParams
  >({
    mutationFn: async ({ name, ...params }) =>
      authFetch.post(`packageprofiles/${name}/constraints`, params),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["packageProfiles"] }),
        queryClient.invalidateQueries({
          queryKey: ["packageProfileConstraints"],
        }),
      ]),
  });

  const editPackageProfileConstraintQuery = useMutation<
    AxiosResponse<PackageProfileConstraint>,
    AxiosError<ApiError>,
    EditPackageProfileConstraintParams
  >({
    mutationFn: async ({ id, name, ...params }) =>
      authFetch.put(`packageprofiles/${name}/constraints/${id}`, params),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["packageProfiles"] }),
        queryClient.invalidateQueries({
          queryKey: ["packageProfileConstraints"],
        }),
      ]),
  });

  const removePackageProfileConstraintsQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemovePackageProfileConstraintsParams
  >({
    mutationFn: async ({ name, ...params }) =>
      authFetch.delete(`packageprofiles/${name}/constraints`, { params }),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["packageProfiles"] }),
        queryClient.invalidateQueries({
          queryKey: ["packageProfileConstraints"],
        }),
      ]),
  });

  return {
    addPackageProfileConstraintsQuery,
    copyPackageProfileQuery,
    createPackageProfileQuery,
    editPackageProfileConstraintQuery,
    editPackageProfileQuery,
    getInstancePackageProfileQuery,
    getPackageProfileConstraintsQuery,
    getPackageProfilesQuery,
    removePackageProfileConstraintsQuery,
    removePackageProfileQuery,
  };
}
