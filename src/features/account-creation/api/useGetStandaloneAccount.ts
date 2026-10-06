import useEnv from "@/hooks/useEnv";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import type { AxiosError } from "axios";
import axios from "axios";
import { API_URL } from "@/constants";
import { useState } from "react";

export const useGetStandaloneAccount = () => {
  const { isSelfHosted } = useEnv();
  const [axiosInstance] = useState(() => axios.create({ baseURL: API_URL }));

  const {
    data: accountExists,
    isLoading,
    error,
  } = useQuery<boolean, AxiosError<ApiError>>({
    queryKey: ["standaloneAccount"],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get<{ exists: boolean }>(
          "standalone-account",
        );
        return data.exists;
      } catch (requestError) {
        if (
          axios.isAxiosError<ApiError>(requestError) &&
          requestError.response?.status === HttpStatusCode.NotFound
        ) {
          return false;
        }

        throw requestError;
      }
    },
    retry: false,
    enabled: isSelfHosted,
    staleTime: 0,
    gcTime: 0,
  });

  return {
    accountExists,
    isLoading,
    error,
  };
};
