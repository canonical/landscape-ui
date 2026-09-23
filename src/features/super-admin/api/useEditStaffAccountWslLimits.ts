import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { WslFeatureLimits } from "../types";

/** All three limits are required: the server replaces the whole set. */
export interface EditStaffAccountWslLimitsParams extends WslFeatureLimits {
  name: string;
}

export const useEditStaffAccountWslLimits = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<WslFeatureLimits>,
    AxiosError<ApiError>,
    EditStaffAccountWslLimitsParams
  >({
    mutationFn: async ({ name, ...limits }) =>
      authFetch.post(
        `accounts/${encodeURIComponent(name)}/wsl-feature-limits`,
        limits,
      ),
    onSuccess: async (_, { name }) =>
      queryClient.invalidateQueries({
        queryKey: ["staffAccounts", name, "wslLimits"],
      }),
  });

  return {
    editWslLimits: mutateAsync,
    isEditingWslLimits: isPending,
  };
};
