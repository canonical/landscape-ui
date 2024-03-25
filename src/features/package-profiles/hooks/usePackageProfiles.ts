import { QueryFnType } from "@/types/QueryFnType";
import {
  PackageProfile,
  PackageProfileConstraint,
} from "@/features/package-profiles/types/PackageProfile";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/types/ApiError";
import useFetchOld from "@/hooks/useFetchOld";
import { Activity } from "@/types/Activity";
import useFetch from "@/hooks/useFetch";

interface GetPackageProfilesParams {
  names?: string[];
}

interface CopyPackageProfileParams {
  name: string;
  access_group?: string;
  description?: string;
  destination_name?: string;
  title?: string;
}

export interface CreatePackageProfileParams {
  description: string;
  title: string;
  access_group?: string;
  all_computers?: boolean;
  constraints?: PackageProfileConstraint[];
  tags?: string[];
}

export interface EditPackageProfileParams
  extends Partial<CreatePackageProfileParams> {
  name: string;
}

interface RemovePackageProfileParams {
  name: string;
}

interface AssociatePackageProfileParams {
  name: string;
  all_computers?: boolean;
  tags?: string[];
}

interface GetParsedPackageProfileConstraintsParams {
  material: string;
}

export interface ParsePackageProfileConstraintsParams {
  material: string;
}

interface GetInstancePackageProfileParams {
  instanceId: number;
}

interface GetInstanceConstraintsParams {
  instanceId: number;
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
      queryFn: () => authFetch!.get("packageprofiles", { params: queryParams }),
      ...config,
    });
  };

  const copyPackageProfileQuery = useMutation<
    AxiosResponse<PackageProfile>,
    AxiosError<ApiError>,
    CopyPackageProfileParams
  >({
    mutationFn: (params) => authFetchOld!.get("CopyPackageProfile", { params }),
    onSuccess: () => queryClient.invalidateQueries(["packageProfiles"]),
  });

  const createPackageProfileQuery = useMutation<
    AxiosResponse<PackageProfile>,
    AxiosError<ApiError>,
    CreatePackageProfileParams
  >({
    mutationFn: (params) => authFetch!.post("packageprofiles", params),
    onSuccess: () => queryClient.invalidateQueries(["packageProfiles"]),
  });

  const removePackageProfileQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemovePackageProfileParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("RemovePackageProfile", { params }),
    onSuccess: () => queryClient.invalidateQueries(["packageProfiles"]),
  });

  const associatePackageProfileQuery = useMutation<
    AxiosResponse<PackageProfile>,
    AxiosError<ApiError>,
    AssociatePackageProfileParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("AssociatePackageProfile", { params }),
    onSuccess: () => queryClient.invalidateQueries(["packageProfiles"]),
  });

  const disassociatePackageProfileQuery = useMutation<
    AxiosResponse<PackageProfile>,
    AxiosError<ApiError>,
    AssociatePackageProfileParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("DisassociatePackageProfile", { params }),
    onSuccess: () => queryClient.invalidateQueries(["packageProfiles"]),
  });

  const editPackageProfileQuery = useMutation<
    AxiosResponse<PackageProfile>,
    AxiosError<ApiError>,
    EditPackageProfileParams
  >({
    mutationFn: ({ name, ...params }) =>
      authFetch!.put(`packageprofiles/${name}`, params),
    onSuccess: () => queryClient.invalidateQueries(["packageProfiles"]),
  });

  const getParsedPackageProfileConstraintsQuery = (
    queryParams: GetParsedPackageProfileConstraintsParams,
    config: Omit<
      UseQueryOptions<
        AxiosResponse<PackageProfileConstraint[]>,
        AxiosError<ApiError>
      >,
      "queryKey" | "queryFn"
    > = {},
  ) =>
    useQuery<AxiosResponse<PackageProfileConstraint[]>, AxiosError<ApiError>>({
      queryKey: ["parsedConstraints", queryParams],
      queryFn: () =>
        authFetch!.get("/packages/profile/parser", {
          params: queryParams,
        }),
      ...config,
    });

  const parsePackageProfileConstraintsQuery = useMutation<
    AxiosResponse<{ result: PackageProfileConstraint[] }>,
    AxiosError<ApiError>,
    ParsePackageProfileConstraintsParams
  >({
    mutationFn: (params) => authFetch!.post("/packages/profile/parser", params),
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
      queryFn: () =>
        authFetch!.get(`computers/${instanceId}/packages/profile`, {
          params: queryParams,
        }),
      ...config,
    });

  const getInstanceConstraintsQuery = (
    { instanceId, ...queryParams }: GetInstanceConstraintsParams,
    config: Omit<
      UseQueryOptions<
        AxiosResponse<{ result: PackageProfileConstraint[] }>,
        AxiosError<ApiError>
      >,
      "queryKey" | "queryFn"
    > = {},
  ) =>
    useQuery<
      AxiosResponse<{ result: PackageProfileConstraint[] }>,
      AxiosError<ApiError>
    >({
      queryKey: ["instanceConstraints", { instanceId, ...queryParams }],
      queryFn: () =>
        authFetch!.get(`computers/${instanceId}/packages/profile`, {
          params: queryParams,
        }),
      ...config,
    });

  return {
    associatePackageProfileQuery,
    copyPackageProfileQuery,
    createPackageProfileQuery,
    disassociatePackageProfileQuery,
    editPackageProfileQuery,
    getPackageProfilesQuery,
    removePackageProfileQuery,
    getParsedPackageProfileConstraintsQuery,
    parsePackageProfileConstraintsQuery,
    getInstancePackageProfileQuery,
    getInstanceConstraintsQuery,
  };
}
