import type { QueryFnType } from "@/types/QueryFnType";
import type { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/types/ApiError";
import useFetch from "./useFetch";
import type { GroupsResponse, User } from "@/types/User";
import type { Activity } from "@/features/activities";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";

interface GetUsersParams {
  computer_id: number;
  limit?: number;
  offset?: number;
  query?: string;
}

interface CreateUserParams {
  computer_ids: number[];
  name: string;
  password: string;
  username: string;
  home_phone?: string;
  location?: string;
  primary_groupname?: string;
  require_password_reset?: boolean;
  work_phone?: string;
}

interface EditUserParams {
  computer_ids: number[];
  username: string;
  home_phone?: string;
  location?: string;
  name?: string;
  password?: string;
  primary_groupname?: string;
  work_phone?: string;
}

interface RemoveUserParams {
  computer_ids: number[];
  usernames: string[];
  delete_home?: boolean;
}

interface LockUserParams {
  computer_ids: number[];
  usernames: string[];
}

interface UnlockUserParams {
  computer_ids: number[];
  usernames: string[];
}

export interface GetGroupsParams {
  computer_id: number;
}

export interface GetUserGroupsParams {
  computer_id: number;
  username: string;
}

interface GroupMutationQueryParams {
  action: "add" | "remove";
  computer_id: number;
  groupnames: string[];
  usernames: string[];
}

export default function useUsers() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const getUsersQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<User>>,
    GetUsersParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<ApiPaginatedResponse<User>>, AxiosError<ApiError>>({
      queryKey: ["users", { ...queryParams }],
      queryFn: () => authFetch.get("users", { params: queryParams }),
      ...config,
    });

  const createUserQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    CreateUserParams
  >({
    mutationKey: ["users", "new"],
    mutationFn: (params) => authFetch.post("users", params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const editUserQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    EditUserParams
  >({
    mutationKey: ["users", "edit"],
    mutationFn: (params) => authFetch.put("users", params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const removeUserQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveUserParams
  >({
    mutationKey: ["users", "remove"],
    mutationFn: (params) => authFetch.delete("users", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const lockUserQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    LockUserParams
  >({
    mutationKey: ["users", "lock"],
    mutationFn: (params) => authFetch.post("users/lock", params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const unlockUserQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UnlockUserParams
  >({
    mutationKey: ["users", "unlock"],
    mutationFn: (params) => authFetch.post("users/unlock", params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const getGroupsQuery: QueryFnType<
    AxiosResponse<GroupsResponse>,
    GetGroupsParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<GroupsResponse>, AxiosError<ApiError>>({
      queryKey: ["groups", queryParams?.computer_id ?? ""],
      queryFn: () => {
        if (!queryParams) {
          throw new Error("Missing required parameters");
        }

        return authFetch.get(`computers/${queryParams.computer_id}/groups`);
      },
      ...config,
    });

  const getUserGroupsQuery: QueryFnType<
    AxiosResponse<GroupsResponse>,
    GetUserGroupsParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<GroupsResponse>, AxiosError<ApiError>>({
      queryKey: [
        "userGroups",
        queryParams?.computer_id ?? "",
        queryParams?.username ?? "",
      ],
      queryFn: () => {
        if (!queryParams) {
          throw new Error("Missing required parameters");
        }

        return authFetch.get(
          `computers/${queryParams.computer_id}/users/${queryParams.username}/groups`,
        );
      },
      ...config,
    });

  const addUserToGroupQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    GroupMutationQueryParams
  >({
    mutationKey: ["groups", "add"],
    mutationFn: (params) => {
      return authFetch.post(
        `computers/${params.computer_id}/usergroups/update_bulk`,
        params,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const removeUserFromGroupQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    GroupMutationQueryParams
  >({
    mutationKey: ["groups", "remove"],
    mutationFn: (params) => {
      return authFetch.post(
        `computers/${params.computer_id}/usergroups/update_bulk`,
        params,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return {
    getUsersQuery,
    getGroupsQuery,
    getUserGroupsQuery,
    createUserQuery,
    removeUserQuery,
    editUserQuery,
    lockUserQuery,
    unlockUserQuery,
    addUserToGroupQuery,
    removeUserFromGroupQuery,
  };
}
