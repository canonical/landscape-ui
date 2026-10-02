import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export default function useDeletePackageChangePlan() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiError>, number>({
    mutationFn: async (id) => authFetch.delete(`package-change-plans/${id}`),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({
        queryKey: ["packageChangePlans", id],
      });
    },
  });
}
