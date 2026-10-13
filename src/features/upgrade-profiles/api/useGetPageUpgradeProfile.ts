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
  // The page param may hold another profile type's name: only a whole id is asked for.
  const id = /^\d+$/.test(upgradeProfileId) ? Number(upgradeProfileId) : NaN;

  const { isGettingUpgradeProfile, upgradeProfile, upgradeProfileError } =
    useGetUpgradeProfile(id);

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
