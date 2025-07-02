import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface GetSecurityProfileReportParams {
  id: number;
  start_date: string;
  detailed?: boolean;
  end_date?: string;
}

export const useGetSecurityProfileReport = () => {
  const authFetch = useFetch();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    GetSecurityProfileReportParams
  >({
    mutationFn: async ({ id, ...params }) =>
      authFetch.get(`security-profiles/${id}/report`, { params }),
  });

  return {
    getSecurityProfileReport: mutateAsync,
    isSecurityProfileReportLoading: isPending,
  };
};
