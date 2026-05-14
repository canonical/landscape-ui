import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { USGProfile } from "../types";

export interface AddUSGProfileParams
  extends
    Pick<USGProfile, "benchmark" | "mode" | "schedule" | "title">,
    Partial<Pick<USGProfile, "access_group" | "all_computers" | "tags">> {
  start_date: string;
  restart_deliver_delay_window?: number;
  restart_deliver_delay?: number;
  tailoring_file?: string;
}

export const useAddUsgProfile = (): {
  isUsgProfileAdding: boolean;
  addUsgProfile: (params: AddUSGProfileParams) => Promise<USGProfile>;
} => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    USGProfile,
    AxiosError<ApiError>,
    AddUSGProfileParams
  >({
    mutationFn: async (params) => authFetch.post("usg-profiles", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["usgProfiles"] }),
  });

  return {
    isUsgProfileAdding: isPending,
    addUsgProfile: mutateAsync,
  };
};
