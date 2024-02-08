import { QueryFnType } from "../types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import {
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiError } from "../types/ApiError";
import useFetch from "./useFetch";
import { GroupsResponse, User } from "../types/User";
import useDebug from "./useDebug";
import { Activity } from "../types/Activity";
import { ApiPaginatedResponse } from "../types/ApiPaginatedResponse";

interface useUserResult {
  getUsersQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<User>>,
    GetUsersParams
  >;
  createUserQuery: UseMutationResult<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    CreateUserParams
  >;
  editUserQuery: UseMutationResult<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    EditUserParams
  >;
  removeUserQuery: UseMutationResult<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveUserParams
  >;
  lockUserQuery: UseMutationResult<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    LockUserParams
  >;
  unlockUserQuery: UseMutationResult<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UnlockUserParams
  >;
  getGroupsQuery: QueryFnType<AxiosResponse<GroupsResponse>, GetGroupsParams>;
  addUserToGroupQuery: UseMutationResult<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    GroupMutationQueryParams
  >;
  removeUserFromGroupQuery: UseMutationResult<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    GroupMutationQueryParams
  >;
}

interface GetUsersParams {
  computer_id: number;
  limit?: number;
  offset?: number;
  query?: string;
}

interface CreateUserParams {
  computer_ids: number[];
  username: string;
  name: string;
  password: string;
  require_password_reset?: boolean;
  primary_groupname?: string;
  location?: string;
  home_phone?: string;
  work_phone?: string;
}

interface EditUserParams {
  computer_ids: number[];
  username: string;
  name?: string;
  password?: string;
  primary_groupname?: string;
  location?: string;
  home_phone?: string;
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

interface GetGroupsParams {
  computer_id: number;
}

interface GroupMutationQueryParams {
  computer_id: number;
  usernames: string[];
  groupnames: string[];
  action: "add" | "remove";
}

export default function useUsers(): useUserResult {
  const authFetch = useFetch();
  const queryClient = useQueryClient();
  const debug = useDebug();

  const getUsersQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<User>>,
    GetUsersParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<ApiPaginatedResponse<User>>, AxiosError<ApiError>>({
      queryKey: ["users", { ...queryParams }],
      queryFn: () => authFetch!.get("users", { params: queryParams }),
      ...config,
    });

  const createUserQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    CreateUserParams
  >({
    mutationKey: ["users", "new"],
    mutationFn: (params) => authFetch!.post("users", params),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]).catch(debug);
    },
  });

  const editUserQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    EditUserParams
  >({
    mutationKey: ["users", "edit"],
    mutationFn: (params) => authFetch!.put("users", params),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]).catch(debug);
    },
  });

  const removeUserQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveUserParams
  >({
    mutationKey: ["users", "remove"],
    mutationFn: (params) => authFetch!.delete("users", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]).catch(debug);
    },
  });

  const lockUserQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    LockUserParams
  >({
    mutationKey: ["users", "lock"],
    mutationFn: (params) => authFetch!.post("users/lock", params),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]).catch(debug);
    },
  });

  const unlockUserQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UnlockUserParams
  >({
    mutationKey: ["users", "unlock"],
    mutationFn: (params) => authFetch!.post("users/unlock", params),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]).catch(debug);
    },
  });

  const getGroupsQuery: QueryFnType<
    AxiosResponse<GroupsResponse>,
    GetGroupsParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<GroupsResponse>, AxiosError<ApiError>>({
      queryKey: ["groups"],
      queryFn: () =>
        authFetch!.get(`computers/${queryParams!.computer_id}/groups`),
      ...config,
    });

  const addUserToGroupQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    GroupMutationQueryParams
  >({
    mutationKey: ["groups", "add"],
    mutationFn: (params) => {
      return authFetch!.post(
        `computers/${params.computer_id}/usergroups/update_bulk`,
        params,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]).catch(debug);
    },
  });

  const removeUserFromGroupQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    GroupMutationQueryParams
  >({
    mutationKey: ["groups", "remove"],
    mutationFn: (params) => {
      return authFetch!.post(
        `computers/${params.computer_id}/usergroups/update_bulk`,
        params,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]).catch(debug);
    },
  });

  return {
    getUsersQuery,
    createUserQuery,
    removeUserQuery,
    editUserQuery,
    lockUserQuery,
    unlockUserQuery,
    getGroupsQuery,
    addUserToGroupQuery,
    removeUserFromGroupQuery,
  };
}
