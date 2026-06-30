import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface EditUserParams {
  computer_ids: number[];
  username: string;
  home_phone?: string;
  location?: string;
  name?: string;
  password?: string;
  primary_groupname?: string;
  work_phone?: string;
}

export const useEditUser = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    EditUserParams
  >({
    mutationKey: ["users", "edit"],
    mutationFn: async (params) => authFetch.put("users", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return {
    editUser: mutateAsync,
    isEditingUser: isPending,
  };
};
