import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export default function useExecutePackageChangePlan() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<Activity>, AxiosError<ApiError>, number>({
    mutationFn: async (id) =>
      authFetch.post(`package-change-plans/${id}:execute`),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({
        queryKey: ["packageChangePlans", id],
      });
    },
  });
}
