import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import { API_URL } from "@/constants";

export interface CreateStandaloneAccountParams {
  email: string;
  name: string;
  password: string;
}

export const useCreateStandaloneAccount = () => {
  const queryClient = useQueryClient();
  const axiosInstance = axios.create({ baseURL: API_URL });

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<unknown>,
    AxiosError<ApiError>,
    CreateStandaloneAccountParams
  >({
    mutationFn: async (params) =>
      axiosInstance.post("standalone-account", params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["standaloneAccount"],
      });
    },
  });

  return {
    createStandaloneAccount: mutateAsync,
    isCreatingStandaloneAccount: isPending,
  };
};
