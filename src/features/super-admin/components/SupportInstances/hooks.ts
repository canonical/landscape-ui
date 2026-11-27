import { getInstanceSearchHelpTerms } from "@/features/instances";
import { useStaffAccountFeatures } from "../../hooks";

const SAVED_SEARCH_TERM = "search:<name>";

/** The instance search terms for the account named `name`, by its own features. */
export const useSupportInstanceSearchHelpTerms = (name: string) => {
  const { isFeatureEnabled } = useStaffAccountFeatures(name);

  return getInstanceSearchHelpTerms({
    isScriptProfilesEnabled: isFeatureEnabled("script-profiles"),
    isUsgProfilesEnabled: isFeatureEnabled("usg-profiles"),
    isWslProfilesEnabled: isFeatureEnabled("wsl-child-instance-profiles"),
  }).filter(({ term }) => term !== SAVED_SEARCH_TERM);
};
