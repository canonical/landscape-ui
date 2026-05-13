import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { FleetTopDetractor } from "../types";

const SIXTY_SECONDS = 60_000;
const DEFAULT_LIMIT = 3;

interface TopDetractorsResponse {
  results: FleetTopDetractor[];
}

export default function useFleetTopDetractors(limit: number = DEFAULT_LIMIT) {
  const authFetch = useFetch();
  return useQuery<
    AxiosResponse<TopDetractorsResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["health", "top-detractors", limit],
    queryFn: async () =>
      authFetch.get(`health/top-detractors?limit=${limit}`),
    staleTime: SIXTY_SECONDS,
  });
}
