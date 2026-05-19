import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  HealthActionKind,
  HealthBulkActionResult,
} from "../types";

interface Variables {
  action: HealthActionKind;
  computerIds: number[];
}

// LA061 Phase 1.8: fan-out one smart action across N computers in one HTTP
// call. The server replies with **HTTP 207 Multi-Status** and a per-computer
// outcome list so a permission gap on 2 of 50 doesn't blow up the rest.
// Callers should inspect `result.success_count` / `result.failure_count` and
// only walk `result.results` when there's a failure to explain.
export default function useBulkHealthAction() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<HealthBulkActionResult>,
    AxiosError<ApiError>,
    Variables
  >({
    mutationFn: async ({ action, computerIds }) =>
      authFetch.post("health/actions/bulk", {
        action,
        computer_ids: computerIds,
      }),
    onSuccess: async (_data, { computerIds }) => {
      // Invalidate the affected per-computer health rows so the next list /
      // detail view refetches; also invalidate the fleet summary because
      // band counts may have shifted.
      await Promise.all([
        ...computerIds.map((id) =>
          queryClient.invalidateQueries({
            queryKey: ["health", "computer", id],
          }),
        ),
        queryClient.invalidateQueries({ queryKey: ["health", "summary"] }),
      ]);
    },
  });
}
