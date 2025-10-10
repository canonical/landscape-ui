import useEnv from "@/hooks/useEnv";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import { API_URL } from "@/constants";
import { useState } from "react";

export const useGetStandaloneAccount = () => {
  const { isSelfHosted } = useEnv();
  const [axiosInstance] = useState(() => axios.create({ baseURL: API_URL }));

  const { data, isLoading, error } = useQuery<
    AxiosResponse<{ exists: boolean }>,
    AxiosError<ApiError>
  >({
    queryKey: ["standaloneAccount"],
    queryFn: async () => await axiosInstance.get("standalone-account"),
    retry: false,
    enabled: isSelfHosted,
    staleTime: 0,
    gcTime: 0,
  });

  const accountExists = data?.data.exists ?? false;

  return {
    accountExists,
    isLoading,
    error,
  };
};
