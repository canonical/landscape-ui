import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import { API_URL } from "@/constants";
import type { ApiError } from "@/types/api/ApiError";
import type { AuthStateResponse, LoginRequestParams } from "@/features/auth";

const publicFetch = axios.create({ baseURL: API_URL });

export function useLogin() {
  const { mutateAsync, isPending, error } = useMutation<
    AxiosResponse<AuthStateResponse>,
    AxiosError<ApiError>,
    LoginRequestParams
  >({
    mutationFn: (params) => publicFetch.post("login", params),
  });

  return {
    login: mutateAsync,
    isLoggingIn: isPending,
    error,
  };
}
