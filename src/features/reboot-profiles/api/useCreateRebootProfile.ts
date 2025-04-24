import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { RebootProfile } from "../types";

interface CreateRebootProfileParams {
  access_group: string;
  at_hour: number;
  at_minute: number;
  deliver_delay_window: number;
  deliver_within: number;
  every: string;
  on_days: string[];
  title: string;
  tags?: string[];
  all_computers?: boolean;
}

export default function useCreateRebootProfile() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const createRebootProfileQuery = useMutation<
    AxiosResponse<RebootProfile>,
    AxiosError<ApiError>,
    CreateRebootProfileParams
  >({
    mutationKey: ["rebootprofiles", "create"],
    mutationFn: async (params) => authFetch.post("rebootprofiles", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["rebootprofiles"] }),
  });

  const { mutateAsync, isPending } = createRebootProfileQuery;

  return {
    createRebootProfile: mutateAsync,
    isCreatingRebootProfile: isPending,
  };
}
