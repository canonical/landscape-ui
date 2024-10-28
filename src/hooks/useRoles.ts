import { QueryFnType } from "@/types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/ApiError";
import useFetchOld from "./useFetchOld";
import { AccessGroup } from "@/types/AccessGroup";
import { Role } from "@/types/Role";
import { Permission } from "@/types/Permission";
import { Activity } from "@/features/activities";

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

export default function useRoles() {
  const authFetch = useFetchOld();
  const queryClient = useQueryClient();

  const getAccessGroupQuery: QueryFnType<
    AxiosResponse<AccessGroup[]>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<AccessGroup[]>, AxiosError<ApiError>>({
      queryKey: ["accessGroups"],
      queryFn: () => authFetch.get("GetAccessGroups", { params: queryParams }),
      ...config,
    });

  const createAccessGroupQuery = useMutation<
    AxiosResponse<AccessGroup>,
    AxiosError<ApiError>,
    CreateAccessGroupParams
  >({
    mutationFn: (params) => authFetch.get("CreateAccessGroup", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accessGroups"] }),
  });

  const removeAccessGroupQuery = useMutation<
    AxiosResponse<AccessGroup>,
    AxiosError<ApiError>,
    RemoveAccessGroupParams
  >({
    mutationFn: (params) => authFetch.get("RemoveAccessGroup", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accessGroups"] }),
  });

  const getRolesQuery: QueryFnType<AxiosResponse<Role[]>, GetRolesParams> = (
    queryParams = {},
    config = {},
  ) =>
    useQuery<AxiosResponse<Role[]>, AxiosError<ApiError>>({
      queryKey: ["roles"],
      queryFn: () => authFetch.get("GetRoles", { params: queryParams }),
      ...config,
    });

  const createRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    CreateRoleParams
  >({
    mutationFn: (params) => authFetch.get("CreateRole", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const copyRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    CopyRoleParams
  >({
    mutationFn: (params) => authFetch.get("CopyRole", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const removeRoleQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveRoleParams
  >({
    mutationFn: (params) => authFetch.get("RemoveRole", { params }),
    onSuccess: () =>
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
    mutationFn: (params) => authFetch.get("AddAccessGroupsToRole", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const removeAccessGroupsFromRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    ChangeRoleAccessGroupsParams
  >({
    mutationFn: (params) =>
      authFetch.get("RemoveAccessGroupsFromRole", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const getPermissionsQuery: QueryFnType<
    AxiosResponse<Permission[]>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<Permission[]>, AxiosError<ApiError>>({
      queryKey: ["permissions"],
      queryFn: () => authFetch.get("GetPermissions", { params: queryParams }),
      ...config,
    });

  const addPermissionsToRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    ChangeRolePermissionsParams
  >({
    mutationFn: (params) => authFetch.get("AddPermissionsToRole", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const removePermissionsFromRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    ChangeRolePermissionsParams
  >({
    mutationFn: (params) =>
      authFetch.get("RemovePermissionsFromRole", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const addPersonsToRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    ChangeRolePersonsParams
  >({
    mutationFn: (params) => authFetch.get("AddPersonsToRole", { params }),
    onSuccess: () =>
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
    mutationFn: (params) => authFetch.get("RemovePersonsFromRole", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["roles"] }),
        queryClient.invalidateQueries({ queryKey: ["administrators"] }),
      ]),
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
  };
}
