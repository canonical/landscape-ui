import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { USGProfile } from "../types";

export interface UpdateUSGProfileParams extends Partial<
  Pick<USGProfile, "all_computers" | "schedule" | "tags" | "title">
> {
  id: number;
  restart_deliver_delay_window?: number;
  restart_deliver_delay?: number;
}

export const useUpdateUsgProfile = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    USGProfile,
    AxiosError<ApiError>,
    UpdateUSGProfileParams
  >({
    mutationFn: async ({ id, tags, ...rest }) => {
      const normalizedTags = tags?.length ? tags : [];
      return authFetch.patch(`security-profiles/${id}`, {
        ...rest,
        tags: normalizedTags,
      });
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["securityProfiles"] });
      await queryClient.invalidateQueries({
        queryKey: ["securityProfile", variables.id],
      });
    },
  });

  return {
    isUsgProfileUpdating: isPending,
    updateUsgProfile: mutateAsync,
  };
};
