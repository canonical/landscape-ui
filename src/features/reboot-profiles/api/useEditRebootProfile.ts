import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { RebootProfile } from "../types";

interface EditRebootProfileParams {
  id: number;
  at_hour?: number;
  at_minute?: number;
  deliver_delay_window?: number;
  deliver_within?: number;
  on_days?: string[];
  title?: string;
  tags?: string[];
  every?: string;
  all_computers?: boolean;
}

export default function useEditRebootProfile() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const editRebootProfileQuery = useMutation<
    AxiosResponse<RebootProfile>,
    AxiosError<ApiError>,
    EditRebootProfileParams
  >({
    mutationKey: ["rebootprofiles", "edit"],
    mutationFn: async ({ id, ...params }) =>
      authFetch.patch(`rebootprofiles/${id}`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["rebootprofiles"] }),
  });

  const { mutateAsync, isPending } = editRebootProfileQuery;

  return {
    editRebootProfile: mutateAsync,
    isEditingRebootProfile: isPending,
  };
}
