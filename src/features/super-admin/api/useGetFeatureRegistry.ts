import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { Feature } from "@/types/Feature";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { FeatureRegistryEntry } from "../types";

/** Gets the registry metadata of every feature, sorted by name. */
export const useGetFeatureRegistry = () => {
  const authFetch = useFetch();

  const {
    data: featureRegistry = [],
    isLoading,
    error,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<Feature>>,
    AxiosError<ApiError>,
    FeatureRegistryEntry[]
  >({
    queryKey: ["featureRegistry"],
    queryFn: async () => authFetch.get("features"),
    select: (response) =>
      response.data.results
        .map(({ database_key, key, name, description }) => ({
          database_key,
          key,
          name,
          description,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
  });

  return {
    featureRegistry,
    featureRegistryError: error,
    isGettingFeatureRegistry: isLoading,
  };
};
