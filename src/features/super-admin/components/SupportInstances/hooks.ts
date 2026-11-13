import { getInstanceSearchHelpTerms } from "@/features/instances";
import type { FeatureKey } from "@/types/FeatureKey";
import { useGetFeatureRegistry, useGetStaffAccount } from "../../api";

const SAVED_SEARCH_TERM = "search:<name>";

/** The instance search terms for the account named `name`, by its own features. */
export const useSupportInstanceSearchHelpTerms = (name: string) => {
  const { staffAccount } = useGetStaffAccount(name);
  const { featureRegistry } = useGetFeatureRegistry();

  const enabledKeys = new Set<string>(
    featureRegistry
      .filter(({ database_key }) =>
        staffAccount?.enabled_features.includes(database_key),
      )
      .map(({ key }) => key),
  );

  return getInstanceSearchHelpTerms((feature: FeatureKey) =>
    enabledKeys.has(feature),
  ).filter(({ term }) => term !== SAVED_SEARCH_TERM);
};
