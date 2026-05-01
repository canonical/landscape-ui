import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface GetUSGProfileReportParams {
  id: number;
  start_date: string;
  detailed?: boolean;
  end_date?: string;
}

export const useGetUsgProfileReport = () => {
  const authFetch = useFetch();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    GetUSGProfileReportParams
  >({
    mutationFn: async ({ id, ...params }) =>
      authFetch.get(`usg-profiles/${id}/report`, { params }),
  });

  return {
    getUsgProfileReport: mutateAsync,
    isUsgProfileReportLoading: isPending,
  };
};
