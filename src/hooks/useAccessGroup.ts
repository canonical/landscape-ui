import { QueryFnType } from "../types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../types/ApiError";
import useFetchOld from "./useFetchOld";
import { AccessGroup } from "../types/AccessGroup";
import useDebug from "./useDebug";
import { Role } from "../types/Role";

interface CreateAccessGroupParams {
  parent: string;
  title: string;
}

interface RemoveAccessGroupParams {
  name: string;
}

interface GetRolesParams {
  names?: string[];
}

interface ChangeRolePersonsParams {
  name: string;
  persons: string[];
}

export default function useAccessGroup() {
  const authFetch = useFetchOld();
  const queryClient = useQueryClient();
  const debug = useDebug();

  const getAccessGroupQuery: QueryFnType<AxiosResponse<AccessGroup[]>, {}> = (
    queryParams = {},
    config = {},
  ) =>
    useQuery<AxiosResponse<AccessGroup[]>, AxiosError<ApiError>>({
      queryKey: ["accessGroups"],
      queryFn: () => authFetch!.get("GetAccessGroups", { params: queryParams }),
      ...config,
    });

  const createAccessGroupQuery = useMutation<
    AxiosResponse<AccessGroup>,
    AxiosError<ApiError>,
    CreateAccessGroupParams
  >({
    mutationKey: ["accessGroups", "new"],
    mutationFn: (params) => authFetch!.get("CreateAccessGroup", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["accessGroups"]).catch(debug);
    },
  });

  const removeAccessGroupQuery = useMutation<
    AxiosResponse<AccessGroup>,
    AxiosError<ApiError>,
    RemoveAccessGroupParams
  >({
    mutationKey: ["accessGroups", "remove"],
    mutationFn: (params) => authFetch!.get("RemoveAccessGroup", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["accessGroups"]).catch(debug);
    },
  });

  const getRolesQuery: QueryFnType<AxiosResponse<Role[]>, GetRolesParams> = (
    queryParams = {},
    config = {},
  ) =>
    useQuery<AxiosResponse<Role[]>, AxiosError<ApiError>>({
      queryKey: ["roles"],
      queryFn: () => authFetch!.get("GetRoles", { params: queryParams }),
      ...config,
    });

  const addPersonsToRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    ChangeRolePersonsParams
  >({
    mutationFn: (params) => authFetch!.get("AddPersonsToRole", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["roles"]),
        queryClient.invalidateQueries(["administrators"]),
      ]),
  });

  const removePersonsFromRoleQuery = useMutation<
    AxiosResponse<Role>,
    AxiosError<ApiError>,
    ChangeRolePersonsParams
  >({
    mutationFn: (params) => authFetch!.get("RemovePersonsFromRole", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["roles"]),
        queryClient.invalidateQueries(["administrators"]),
      ]),
  });

  return {
    getAccessGroupQuery,
    createAccessGroupQuery,
    removeAccessGroupQuery,
    getRolesQuery,
    addPersonsToRoleQuery,
    removePersonsFromRoleQuery,
  };
}
