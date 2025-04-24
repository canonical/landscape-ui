import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { QueryFnType } from "@/types/api/QueryFnType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  ChangePasswordParams,
  EditUserDetailsParams,
  UserDetails,
} from "../types";

export default function useUserGeneralSettings() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const getUserDetails: QueryFnType<
    AxiosResponse<UserDetails>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<UserDetails>, AxiosError<ApiError>>({
      queryKey: ["userDetails", "get"],
      queryFn: async () => authFetch.get("person", { params: queryParams }),
      ...config,
    });

  const editUserDetails = useMutation<
    AxiosResponse<UserDetails>,
    AxiosError<ApiError>,
    EditUserDetailsParams
  >({
    mutationKey: ["userDetails", "edit"],
    mutationFn: async (params) => authFetch.post("person", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["userDetails", "get"] }),
  });

  const changePassword = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    ChangePasswordParams
  >({
    mutationKey: ["userDetails", "changePassword"],
    mutationFn: async (params) => authFetch.put("password", params),
  });

  return {
    getUserDetails,
    editUserDetails,
    changePassword,
  };
}
