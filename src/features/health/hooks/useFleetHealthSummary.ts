import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { FleetHealthSummary } from "../types";

const SIXTY_SECONDS = 60_000;

export default function useFleetHealthSummary() {
  const authFetch = useFetch();
  return useQuery<AxiosResponse<FleetHealthSummary>, AxiosError<ApiError>>({
    queryKey: ["health", "summary"],
    queryFn: async () => authFetch.get("health/summary"),
    // Worker-updated, not real-time-critical — a 60s stale window keeps the
    // dashboard responsive without hammering the endpoint during navigation.
    staleTime: SIXTY_SECONDS,
  });
}
