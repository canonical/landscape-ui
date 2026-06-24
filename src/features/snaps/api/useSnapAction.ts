import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { InstalledSnap, SnapActionParams } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export const useSnapAction = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<InstalledSnap>,
    AxiosError<ApiError>,
    SnapActionParams
  >({
    mutationKey: ["snaps", "action"],
    mutationFn: async (params) => authFetch.post("snaps", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["snaps"] }),
  });

  return {
    snapAction: mutateAsync,
    isSnapActionPending: isPending,
  };
};
