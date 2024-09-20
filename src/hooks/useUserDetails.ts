import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/types/ApiError";
import { QueryFnType } from "@/types/QueryFnType";
import {
  ApiKeyCredentials,
  UserCredentials,
  UserDetails,
} from "@/types/UserDetails";
import useFetch from "./useFetch";

interface GenerateApiCredentialsParams {
  account: string;
}

interface EditUserDetailsParams {
  email: string;
  name: string;
  timezone: string;
  preferred_account: string;
}

interface ChangePasswordParamms {
  password: string;
  new_password: string;
}

export default function useUserDetails() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const getUserDetails: QueryFnType<
    AxiosResponse<UserDetails>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<UserDetails>, AxiosError<ApiError>>({
      queryKey: ["userDetails", "get"],
      queryFn: () => authFetch!.get("person", { params: queryParams }),
      ...config,
    });

  const getUserApiCredentials: QueryFnType<
    AxiosResponse<UserCredentials>,
    Record<never, unknown>
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
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["userDetails", "getCredentials"],
      }),
  });

  const editUserDetails = useMutation<
    AxiosResponse<UserDetails>,
    AxiosError<ApiError>,
    EditUserDetailsParams
  >({
    mutationKey: ["userDetails", "edit"],
    mutationFn: (params) => authFetch!.post("person", params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userDetails", "get"] }),
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
    changePassword,
  };
}
