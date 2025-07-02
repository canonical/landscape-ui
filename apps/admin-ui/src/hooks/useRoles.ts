import type { QueryFnType } from "@/types/api/QueryFnType";
import type { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/types/api/ApiError";
import useFetchOld from "./useFetchOld";
import type { AccessGroup } from "@/features/access-groups";
import type { Role } from "@/types/Role";
import type { Permission } from "@/types/Permission";
import type { Activity } from "@/features/activities";
import type { Instance } from "@/types/Instance";

export interface CreateAccessGroupParams {
  parent: string;
  title: string;
}

export interface RemoveAccessGroupParams {
  name: string;
}

export interface GetRolesParams {
  names?: string[];
}

export interface CreateRoleParams {
  name: string;
  description?: string;
}

export interface CopyRoleParams {
  destination_name: string;
  name: string;
  description?: string;
}

export interface RemoveRoleParams {
  name: string;
}

export interface ChangeRoleAccessGroupsParams {
  access_groups: string[];
  name: string;
}

export interface ChangeRolePermissionsParams {
  name: string;
  permissions: string[];
}

export interface ChangeRolePersonsParams {
  name: string;
  persons: string[];
}

interface ChangeComputersAccessGroupParams {
  access_group: string;
  query: string;
}

export default function useRoles() {
  const authFetch = useFetchOld();
  const queryClient = useQueryClient();

  const getAccessGroupQuery: QueryFnType<
    AxiosResponse<AccessGroup[]>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<AccessGroup[]>, AxiosError<ApiError>>({
      queryKey: ["accessGroups"],
      queryFn: async () =>
        authFetch.get("GetAccessGroups", { params: queryParams }),
      ...config,
    });

  const createAccessGroupQuery = useMutation<
    AxiosResponse<AccessGroup>,
    AxiosError<ApiError>,
    CreateAccessGroupParams
  >({
    mutationFn: async (params) =>
      authFetch.get("CreateAccessGroup", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["accessGroups"] }),
  });

  const removeAccessGroupQuery = useMutation<
    AxiosResponse<AccessGroup>,
    AxiosError<ApiError>,
    RemoveAccessGroupParams
  >({
    mutationFn: async (params) =>
      authFetch.get("RemoveAccessGroup", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["accessGroups"] }),
  });

  const getRolesQuery: QueryFnType<AxiosResponse<Role[]>, GetRolesParams> = (
    queryParams = {},
    config = {},
  ) =>
    useQuery<AxiosResponse<Role[]>, AxiosError<ApiError>>({
      queryKey: ["roles"],
      queryFn: async () => authFetch.get("GetRoles", { params: queryParams }),
      ...config,
    });

  const createRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    CreateRoleParams
  >({
    mutationFn: async (params) => authFetch.get("CreateRole", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const copyRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    CopyRoleParams
  >({
    mutationFn: async (params) => authFetch.get("CopyRole", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const removeRoleQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveRoleParams
  >({
    mutationFn: async (params) => authFetch.get("RemoveRole", { params }),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["roles"] }),
        queryClient.invalidateQueries({ queryKey: ["administrators"] }),
      ]),
  });

  const addAccessGroupsToRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    ChangeRoleAccessGroupsParams
  >({
    mutationFn: async (params) =>
      authFetch.get("AddAccessGroupsToRole", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const removeAccessGroupsFromRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    ChangeRoleAccessGroupsParams
  >({
    mutationFn: async (params) =>
      authFetch.get("RemoveAccessGroupsFromRole", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const getPermissionsQuery: QueryFnType<
    AxiosResponse<Permission[]>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<Permission[]>, AxiosError<ApiError>>({
      queryKey: ["permissions"],
      queryFn: async () =>
        authFetch.get("GetPermissions", { params: queryParams }),
      ...config,
    });

  const addPermissionsToRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    ChangeRolePermissionsParams
  >({
    mutationFn: async (params) =>
      authFetch.get("AddPermissionsToRole", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const removePermissionsFromRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    ChangeRolePermissionsParams
  >({
    mutationFn: async (params) =>
      authFetch.get("RemovePermissionsFromRole", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const addPersonsToRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    ChangeRolePersonsParams
  >({
    mutationFn: async (params) => authFetch.get("AddPersonsToRole", { params }),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["roles"] }),
        queryClient.invalidateQueries({ queryKey: ["administrators"] }),
      ]),
  });

  const removePersonsFromRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    ChangeRolePersonsParams
  >({
    mutationFn: async (params) =>
      authFetch.get("RemovePersonsFromRole", { params }),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["roles"] }),
        queryClient.invalidateQueries({ queryKey: ["administrators"] }),
      ]),
  });

  const changeComputersAccessGroupQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    ChangeComputersAccessGroupParams
  >({
    mutationFn: async (params) =>
      authFetch.get("ChangeComputersAccessGroup", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  return {
    getAccessGroupQuery,
    createAccessGroupQuery,
    removeAccessGroupQuery,
    getRolesQuery,
    createRoleQuery,
    copyRoleQuery,
    removeRoleQuery,
    addAccessGroupsToRoleQuery,
    removeAccessGroupsFromRoleQuery,
    getPermissionsQuery,
    addPermissionsToRoleQuery,
    removePermissionsFromRoleQuery,
    addPersonsToRoleQuery,
    removePersonsFromRoleQuery,
    changeComputersAccessGroupQuery,
  };
}
