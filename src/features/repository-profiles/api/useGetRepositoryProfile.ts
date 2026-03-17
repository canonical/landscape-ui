import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { RepositoryProfile } from "../types";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";

export function useGetRepositoryProfile(name: string) {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<RepositoryProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["repositoryProfile", name],
    queryFn: async ({ signal }) =>
      authFetch.get("repositoryprofiles", {
        params: { search: name },
        signal,
      }),
  });

  const repositoryProfile = response?.data.results[0];

  return {
    repositoryProfile,
    repositoryProfileError:
      response && !repositoryProfile
        ? new Error("The repository profile could not be found.")
        : error,
    isGettingRepositoryProfile: isPending,
  };
}
