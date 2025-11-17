import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { WslProfile } from "../types";

interface AddWslProfileParams {
  description: string;
  image_name: string;
  title: string;
  access_group?: string;
  all_computers?: boolean;
  cloud_init_contents?: string;
  image_source?: string;
  only_landscape_created?: boolean;
  tags?: string[];
}

export const useAddWslProfile = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<WslProfile>,
    AxiosError<ApiError>,
    AddWslProfileParams
  >({
    mutationFn: async (params) =>
      authFetch.post("child-instance-profiles", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["wslProfiles"] }),
  });

  return {
    isAddingWslProfile: isPending,
    addWslProfile: mutateAsync,
  };
};
