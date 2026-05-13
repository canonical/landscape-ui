import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { HealthActionKind, HealthActionResult } from "../types";

interface Variables {
  computerId: number;
  action: HealthActionKind;
}

// Fires a stub remediation action. The server-side endpoint enqueues an
// activity equivalent to the user clicking the matching button on the Info
// tab; full plumbing lands with the real remediation work.
export default function useHealthAction() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<HealthActionResult>,
    AxiosError<ApiError>,
    Variables
  >({
    mutationFn: async ({ computerId, action }) =>
      authFetch.post(`computers/${computerId}/health/actions`, { action }),
    onSuccess: async (_data, { computerId }) => {
      // The action will (eventually) clear or move a factor; invalidate the
      // per-computer health row so the Health tab re-fetches.
      await queryClient.invalidateQueries({
        queryKey: ["health", "computer", computerId],
      });
    },
  });
}
