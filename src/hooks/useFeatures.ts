import { useCallback } from "react";
import type { FeatureKey } from "@/types/FeatureKey";
import type { Feature } from "@/types/Feature";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import type { ApiError } from "@/types/api/ApiError";
import { API_URL } from "@/constants";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";

export default function useFeatures(userEmail: string | null) {
  const { data: features = [], isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<Feature>>,
    AxiosError<ApiError>,
    Feature[]
  >({
    queryKey: ["features", userEmail],
    queryFn: async () => axios.get(`${API_URL}features`),
    select: (response) => response.data?.results,
  });

  const isFeatureEnabled = useCallback(
    (featureKey: FeatureKey) => {
      const match = features.find((feature) => feature.key === featureKey);

      if (!match) {
        console.warn(
          `Feature ${featureKey} not found in the features response.`,
        );
        return false;
      }

      return match.enabled;
    },
    [features],
  );

  return {
    isFeatureEnabled,
    isFeaturesLoading: isLoading,
  };
}
