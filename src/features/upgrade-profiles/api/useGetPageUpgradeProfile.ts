import usePageParams from "@/hooks/usePageParams";
import type { UpgradeProfile } from "../types";
import { useGetUpgradeProfile } from "./useGetUpgradeProfile";

export const useGetPageUpgradeProfile = ():
  | {
      upgradeProfile: UpgradeProfile;
      isGettingUpgradeProfile: false;
    }
  | {
      upgradeProfile: undefined;
      isGettingUpgradeProfile: true;
    } => {
  const { name: upgradeProfileId } = usePageParams();

  const { isGettingUpgradeProfile, upgradeProfile, upgradeProfileError } =
    useGetUpgradeProfile(parseInt(upgradeProfileId));

  if (upgradeProfileError) {
    throw upgradeProfileError;
  }

  if (isGettingUpgradeProfile) {
    return {
      upgradeProfile: undefined,
      isGettingUpgradeProfile: true,
    };
  }

  return {
    upgradeProfile: upgradeProfile as UpgradeProfile,
    isGettingUpgradeProfile: false,
  };
};

export default useGetPageUpgradeProfile;
