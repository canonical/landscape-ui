import { useCallback } from "react";
import type { FeatureKey } from "@/types/FeatureKey";
import type { DebarchiveFeature, Feature } from "@/types/Feature";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import type { ApiError } from "@/types/api/ApiError";
import { API_URL, API_URL_DEB_ARCHIVE, IS_DEV_ENV } from "@/constants";
import useEnv from "@/hooks/useEnv";

interface DebarchiveFeatureResponse {
  readonly features: DebarchiveFeature[];
  readonly nextPageToken: string;
}

export default function useFeatures(userEmail: string | null) {
  const { isSelfHosted } = useEnv();

  const { data: serverFeatures = [], isPending: isGettingFeatures } = useQuery<
    AxiosResponse<{ results: Feature[] }>,
    AxiosError<ApiError>,
    Feature[]
  >({
    queryKey: ["features", userEmail],
    queryFn: async () => axios.get(`${API_URL}features`),
    select: (response) => response.data?.results,
  });

  const isRepositoryMirrorsEnabled = serverFeatures.some(
    ({ key, enabled }) => key === "repository-mirrors" && enabled,
  );

  const {
    data: debarchiveFeatures = [],
    isLoading: isGettingDebarchiveFeatures,
  } = useQuery<
    AxiosResponse<DebarchiveFeatureResponse>,
    AxiosError<ApiError>,
    DebarchiveFeature[]
  >({
    queryKey: ["debarchive", "features", userEmail],
    queryFn: async () => axios.get(`${API_URL_DEB_ARCHIVE}features`),
    select: (response) => response.data?.features,
    enabled: isSelfHosted || isRepositoryMirrorsEnabled,
  });

  const isLoading = isGettingFeatures || isGettingDebarchiveFeatures;

  const isFeatureEnabled = useCallback(
    (featureKey: FeatureKey) => {
      const match =
        serverFeatures.find(({ key }) => key === featureKey) ??
        debarchiveFeatures.find(({ featureId }) => featureId === featureKey);

      if (!match) {
        if (IS_DEV_ENV && !isLoading) {
          console.warn(
            `Feature ${featureKey} not found in the features response.`,
          );
        }
        return false;
      }

      return match.enabled;
    },
    [serverFeatures, debarchiveFeatures, isLoading],
  );

  return {
    isFeatureEnabled,
    isFeaturesLoading: isLoading,
  };
}
