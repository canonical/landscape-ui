import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { RepositoryProfile } from "../types";

export function useGetRepositoryProfile(name: string) {
  const authFetch = useFetch();

  return useSuspenseQuery<RepositoryProfile, AxiosError<ApiError>>({
    queryKey: ["repositoryProfile", name],
    queryFn: async () => {
      const response =
        await authFetch.get<ApiPaginatedResponse<RepositoryProfile>>(
          "repositoryprofiles",
        );
      const profile = response.data.results.find((p) => p.name === name);

      if (!profile) throw new Error(`Repository profile "${name}" not found`);

      return profile;
    },
  });
}
