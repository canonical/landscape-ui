import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { FleetHealthSummary, HealthGroupBy } from "../types";

const SIXTY_SECONDS = 60_000;

// LA061 Phase 1.8: GET /health/summary?group_by=... backing the HealthByGroup
// widget. The flat-summary fields are still present on the response — the
// `groups` array carries the per-dimension breakdown (top-N + "other"). When
// the server returns no breakdown (e.g. nothing to group) the field is
// omitted; the widget renders an empty state.
export default function useHealthSummaryByGroup(groupBy: HealthGroupBy) {
  const authFetch = useFetch();
  return useQuery<AxiosResponse<FleetHealthSummary>, AxiosError<ApiError>>({
    queryKey: ["health", "summary", "by-group", groupBy],
    queryFn: async () =>
      authFetch.get(`health/summary?group_by=${encodeURIComponent(groupBy)}`),
    staleTime: SIXTY_SECONDS,
  });
}
