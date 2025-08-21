import usePageParams from "@/hooks/usePageParams";
import type { RebootProfile } from "../types";
import useGetRebootProfile from "./useGetRebootProfile";

const useRebootProfileSidePanel = ():
  | {
      rebootProfile: RebootProfile;
      isGettingRebootProfile: false;
    }
  | { rebootProfile: undefined; isGettingRebootProfile: true } => {
  const { profile: rebootProfileId } = usePageParams();

  const { isGettingRebootProfile, rebootProfile, rebootProfileError } =
    useGetRebootProfile({ id: parseInt(rebootProfileId) });

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

export default useRebootProfileSidePanel;
