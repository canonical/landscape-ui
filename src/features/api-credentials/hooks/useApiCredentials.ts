import useFetch from "@/hooks/useFetch";
import { ApiError } from "@/types/ApiError";
import { QueryFnType } from "@/types/QueryFnType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import {
  ApiKeyCredentials,
  GenerateApiCredentialsParams,
  UserCredentials,
} from "../types";

export default function getUserApiCredentials() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const getUserApiCredentials: QueryFnType<
    AxiosResponse<UserCredentials>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<UserCredentials>, AxiosError<ApiError>>({
      queryKey: ["userDetails", "getCredentials"],
      queryFn: () => authFetch.get("credentials", { params: queryParams }),
      ...config,
    });

  const generateApiCredentials = useMutation<
    AxiosResponse<ApiKeyCredentials>,
    AxiosError<ApiError>,
    GenerateApiCredentialsParams
  >({
    mutationKey: ["userDetails", "generate"],
    mutationFn: (params) => authFetch.post("credentials", params),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["userDetails", "getCredentials"],
      }),
  });

  return { getUserApiCredentials, generateApiCredentials };
}
