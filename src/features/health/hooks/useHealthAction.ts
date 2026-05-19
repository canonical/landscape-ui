import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { HealthActionKind, HealthActionResult } from "../types";

interface Variables {
  computerId: number;
  action: HealthActionKind;
}

// LA061 Phase 1.7: dispatches a smart action against the computer's health
// state. The server enqueues a real activity (`reboot`,
// `run-security-updates`) or marks the computer dirty server-side
// (`refresh-facts`). On success the per-computer health query is
// invalidated so the panel re-fetches the freshly-updated state.
//
// Error toasts are surfaced by the caller (see HealthDetailsPanel) — this
// hook propagates the AxiosError verbatim so the call site can branch on
// 403 / 409 / 501.
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
