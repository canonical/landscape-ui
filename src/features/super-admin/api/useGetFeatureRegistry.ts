import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { Feature } from "@/types/Feature";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { FeatureRegistryEntry } from "../types";

/** `GET features` lists the whole registry at once, without the paginated envelope's `count` and links. */
interface FeatureRegistryResponse {
  results: Feature[];
}

/**
 * Gets the registry metadata of every feature, sorted by name. The endpoint
 * is not paginated: it returns the whole registry in one response.
 */
export const useGetFeatureRegistry = () => {
  const authFetch = useFetch();

  const {
    data: featureRegistry = [],
    isLoading,
    error,
  } = useQuery<
    AxiosResponse<FeatureRegistryResponse>,
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
