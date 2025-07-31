import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { WslProfile } from "../types";

interface EditWslProfileParams {
  name: string;
  access_group?: string;
  all_computers?: boolean;
  description?: string;
  tags?: string[];
  title?: string;
}

export const useEditWslProfile = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<WslProfile>,
    AxiosError<ApiError>,
    EditWslProfileParams
  >({
    mutationFn: async ({ name, ...params }) =>
      authFetch.patch(`child-instance-profiles/${name}`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["wslProfiles"] }),
  });

  return {
    editWslProfile: mutateAsync,
    isEditingWslProfile: isPending,
  };
};
