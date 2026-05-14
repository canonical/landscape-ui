import usePageParams from "@/hooks/usePageParams";
import type { RebootProfile } from "../types";
import useGetRebootProfile from "./useGetRebootProfile";

const useGetPageRebootProfile = ():
  | {
      rebootProfile: RebootProfile;
      isGettingRebootProfile: false;
    }
  | { rebootProfile: undefined; isGettingRebootProfile: true } => {
  const { name: rebootProfileId } = usePageParams();

  const { isGettingRebootProfile, rebootProfile, rebootProfileError } =
    useGetRebootProfile(
      { id: parseInt(rebootProfileId) },
      { enabled: !!rebootProfileId },
    );

  if (rebootProfileError) {
    throw rebootProfileError;
  }

  if (isGettingRebootProfile) {
    return {
      rebootProfile: undefined,
      isGettingRebootProfile: true,
    };
  }

  return {
    rebootProfile: rebootProfile as RebootProfile,
    isGettingRebootProfile: false,
  };
};

export default useGetPageRebootProfile;
