import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface CreateUserParams {
  computer_ids: number[];
  name: string;
  password: string;
  username: string;
  home_phone?: string;
  location?: string;
  primary_groupname?: string;
  require_password_reset?: boolean;
  work_phone?: string;
}

export const useCreateUser = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    CreateUserParams
  >({
    mutationKey: ["users", "new"],
    mutationFn: async (params) => authFetch.post("users", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return {
    createUser: mutateAsync,
    isCreatingUser: isPending,
  };
};
