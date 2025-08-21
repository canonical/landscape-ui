import usePageParams from "@/hooks/usePageParams";
import type { WslProfile } from "../types";
import { useGetWslProfile } from "./useGetWslProfile";

const useGetPageWslProfile = ():
  | {
      wslProfile: WslProfile;
      isGettingWslProfile: false;
    }
  | {
      wslProfile: undefined;
      isGettingWslProfile: true;
    } => {
  const { profile: wslProfileName } = usePageParams();

  const { wslProfile, isGettingWslProfile, wslProfileError } = useGetWslProfile(
    { profile_name: wslProfileName },
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

export default useGetPageWslProfile;
