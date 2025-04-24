import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { QueryFnType } from "@/types/api/QueryFnType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  ApiKeyCredentials,
  GenerateApiCredentialsParams,
  UserCredentials,
} from "../types";

export default function useApiCredentials() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const fetchUserApiCredentials: QueryFnType<
    AxiosResponse<UserCredentials>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<UserCredentials>, AxiosError<ApiError>>({
      queryKey: ["userDetails", "getCredentials"],
      queryFn: async () =>
        authFetch.get("credentials", { params: queryParams }),
      ...config,
    });

  const generateApiCredentials = useMutation<
    AxiosResponse<ApiKeyCredentials>,
    AxiosError<ApiError>,
    GenerateApiCredentialsParams
  >({
    mutationKey: ["userDetails", "generate"],
    mutationFn: async (params) => authFetch.post("credentials", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({
        queryKey: ["userDetails", "getCredentials"],
      }),
  });

  return { fetchUserApiCredentials, generateApiCredentials };
}
