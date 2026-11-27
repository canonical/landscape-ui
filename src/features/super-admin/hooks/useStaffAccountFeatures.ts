import type { FeatureKey } from "@/types/FeatureKey";
import { useGetFeatureRegistry, useGetStaffAccount } from "../api";

/** Whether a feature is enabled for the account named `name`. */
export const useStaffAccountFeatures = (name: string) => {
  const { staffAccount } = useGetStaffAccount(name);
  const { featureRegistry } = useGetFeatureRegistry();

  const enabledKeys = new Set<string>(
    featureRegistry
      .filter(({ database_key }) =>
        staffAccount?.enabled_features.includes(database_key),
      )
      .map(({ key }) => key),
  );

  return {
    isFeatureEnabled: (feature: FeatureKey): boolean =>
      enabledKeys.has(feature),
  };
};
