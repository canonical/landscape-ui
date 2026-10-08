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
  // The page param may hold another profile type's name: only a whole id is asked for.
  const id = /^\d+$/.test(rebootProfileId) ? Number(rebootProfileId) : NaN;

  const { isGettingRebootProfile, rebootProfile, rebootProfileError } =
    useGetRebootProfile({ id }, { enabled: !Number.isNaN(id) });

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
