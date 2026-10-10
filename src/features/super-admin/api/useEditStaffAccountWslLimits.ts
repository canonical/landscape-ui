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

  const { mutateAsync, isPending, error } = useMutation<
    AxiosResponse<WslFeatureLimits>,
    AxiosError<ApiError>,
    EditStaffAccountWslLimitsParams
  >({
    mutationFn: async ({ name, ...limits }) =>
      authFetch.post(
        `accounts/${encodeURIComponent(name)}/wsl-feature-limits`,
        limits,
      ),
    // The response is the saved set, so it replaces the cached one outright:
    // a refetch straight after the first write has been seen to return the
    // defaults the account had before it.
    onSuccess: (response, { name }) => {
      queryClient.setQueryData(["staffAccountWslLimits", name], response);
    },
  });

  return {
    editWslLimits: mutateAsync,
    isEditingWslLimits: isPending,
    editWslLimitsError: error,
  };
};
