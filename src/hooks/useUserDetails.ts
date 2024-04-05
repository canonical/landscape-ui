import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "../types/ApiError";
import { QueryFnType } from "../types/QueryFnType";
import {
  ApiKeyCredentials,
  UserCredentials,
  UserDetails,
} from "../types/UserDetails";
import useFetch from "./useFetch";
import useDebug from "./useDebug";

interface GenerateApiCredentialsParams {
  account: string;
}

interface EditUserDetailsParams {
  email: string;
  name: string;
  timezone: string;
}

interface SetPreferredAccountParams {
  preferred_account: string;
}

interface ChangePasswordParamms {
  password: string;
  new_password: string;
}

interface useUserDetailsResult {
  getUserDetails: QueryFnType<AxiosResponse<UserDetails>, {}>;
  getUserApiCredentials: QueryFnType<AxiosResponse<UserCredentials>, {}>;
  generateApiCredentials: UseMutationResult<
    AxiosResponse<ApiKeyCredentials>,
    AxiosError<ApiError>,
    GenerateApiCredentialsParams
  >;
  editUserDetails: UseMutationResult<
    AxiosResponse<UserDetails>,
    AxiosError<ApiError>,
    EditUserDetailsParams
  >;
  setPreferredAccount: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    SetPreferredAccountParams
  >;
  changePassword: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    ChangePasswordParamms
  >;
}

export default function useUserDetails(): useUserDetailsResult {
  const authFetch = useFetch();
  const queryClient = useQueryClient();
  const debug = useDebug();

  const getUserDetails: QueryFnType<AxiosResponse<UserDetails>, {}> = (
    queryParams = {},
    config = {},
  ) =>
    useQuery<AxiosResponse<UserDetails>, AxiosError<ApiError>>({
      queryKey: ["userDetails", "get"],
      queryFn: () => authFetch!.get("person", { params: queryParams }),
      ...config,
    });

  const getUserApiCredentials: QueryFnType<
    AxiosResponse<UserCredentials>,
    {}
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<UserCredentials>, AxiosError<ApiError>>({
      queryKey: ["userDetails", "getCredentials"],
      queryFn: () => authFetch!.get("credentials", { params: queryParams }),
      ...config,
    });

  const generateApiCredentials = useMutation<
    AxiosResponse<ApiKeyCredentials>,
    AxiosError<ApiError>,
    GenerateApiCredentialsParams
  >({
    mutationKey: ["userDetails", "generate"],
    mutationFn: (params) => authFetch!.post("credentials", params),
    onSuccess: () => {
      queryClient
        .invalidateQueries(["userDetails", "getCredentials"])
        .catch(debug);
    },
  });

  const editUserDetails = useMutation<
    AxiosResponse<UserDetails>,
    AxiosError<ApiError>,
    EditUserDetailsParams
  >({
    mutationKey: ["userDetails", "edit"],
    mutationFn: (params) => authFetch!.post("person", params),
    onSuccess: () => {
      queryClient.invalidateQueries(["userDetails", "get"]).catch(debug);
    },
  });

  const setPreferredAccount = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    SetPreferredAccountParams
  >({
    mutationKey: ["userDetails", "preferredAccount"],
    mutationFn: (params) => authFetch!.post("person", params),
    onSuccess: () => {
      queryClient.invalidateQueries(["userDetails", "get"]).catch(debug);
    },
  });

  const changePassword = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    ChangePasswordParamms
  >({
    mutationKey: ["userDetails", "changePassword"],
    mutationFn: (params) => authFetch!.put("password", params),
  });

  return {
    getUserDetails,
    generateApiCredentials,
    getUserApiCredentials,
    editUserDetails,
    setPreferredAccount,
    changePassword,
  };
}
