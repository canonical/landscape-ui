import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { Instance } from "@/types/Instance";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export const useGetProfileInstancesCount = (profileId: number) => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<ApiPaginatedResponse<Instance>>,
    AxiosError<ApiError>
  >({
    queryKey: ["profileInstancesCount", profileId],
    queryFn: async () =>
      authFetch.get("computers", {
        params: {
          query: `profile:repository:${profileId}`,
          root_only: false,
          limit: 1,
        },
      }),
  });

  return {
    associatedCount: response?.data.count ?? 0,
    isLoadingCount: isPending,
  };
};
