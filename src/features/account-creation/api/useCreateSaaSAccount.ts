import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface CreateSaaSAccountParams {
  title: string;
  email?: string;
  password?: string;
}

export const useCreateSaaSAccount = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    CreateSaaSAccountParams
  >({
    mutationFn: async (params) => authFetch.post("accounts", params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return {
    createSaaSAccount: mutateAsync,
    isCreatingSaaSAccount: isPending,
  };
};
