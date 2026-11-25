import { useQuery } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import { useParams } from "react-router";
import { API_URL } from "@/constants";
import type { ApiError } from "@/types/api/ApiError";

const publicFetch = axios.create({ baseURL: API_URL });

export default function useGetPasswordResetStatus() {
  const { secureToken } = useParams<{ secureToken: string }>();
  const {
    data: status,
    isFetching,
    isPending,
    error,
    refetch,
  } = useQuery<{ valid: boolean }, AxiosError<ApiError>>({
    queryKey: ["passwordResetStatus", secureToken],
    queryFn: async ({ signal }) => {
      const { data } = await publicFetch.get<{ valid: boolean }>(
        `password-reset/${encodeURIComponent(secureToken ?? "")}/status`,
        { signal },
      );
      return data;
    },
    enabled: !!secureToken,
    gcTime: 0,
  });

  return {
    secureToken,
    isValid: status?.valid === true,
    isCheckingPasswordReset: isFetching || isPending,
    error,
    retryPasswordResetStatus: refetch,
  };
}
