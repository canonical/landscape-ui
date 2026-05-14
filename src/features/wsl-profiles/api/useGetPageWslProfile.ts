import usePageParams from "@/hooks/usePageParams";
import type { WslProfile } from "../types";
import { useGetWslProfile } from "./useGetWslProfile";

export const useGetPageWslProfile = ():
  | {
      wslProfile: WslProfile;
      isGettingWslProfile: false;
    }
  | {
      wslProfile: undefined;
      isGettingWslProfile: true;
    } => {
  const { name: wslProfileName } = usePageParams();

  const { wslProfile, isGettingWslProfile, wslProfileError } = useGetWslProfile(
    { profile_name: wslProfileName },
    { enabled: !!wslProfileName },
  );

  if (wslProfileError) {
    throw wslProfileError;
  }

  if (isGettingWslProfile) {
    return {
      wslProfile: undefined,
      isGettingWslProfile: true,
    };
  }

  return {
    wslProfile: wslProfile as WslProfile,
    isGettingWslProfile: false,
  };
};
