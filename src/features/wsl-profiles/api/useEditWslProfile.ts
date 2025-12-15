import { API_URL } from "@/constants";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import type { WslProfile } from "../types";

interface EditWslProfileParams {
  name: string;
  all_computers?: boolean;
  description?: string;
  tags?: string[];
  title?: string;
}

export const useEditWslProfile = () => {
  const queryClient = useQueryClient();

  // TODO: Update useFetch to avoid doing this: https://warthogs.atlassian.net/browse/LNDENG-3458
  const authFetch = axios.create({
    baseURL: API_URL,
  });

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
