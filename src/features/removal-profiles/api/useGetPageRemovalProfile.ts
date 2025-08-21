import usePageParams from "@/hooks/usePageParams";
import { useGetRemovalProfile } from ".";
import type { RemovalProfile } from "../types";

const useGetPageRemovalProfile = ():
  | {
      removalProfile: RemovalProfile;
      isGettingRemovalProfile: false;
    }
  | { removalProfile: undefined; isGettingRemovalProfile: true } => {
  const { profile: removalProfileId } = usePageParams();

  const { isGettingRemovalProfile, removalProfile, removalProfileError } =
    useGetRemovalProfile(parseInt(removalProfileId));

  if (removalProfileError) {
    throw removalProfileError;
  }

  if (isGettingRemovalProfile) {
    return {
      removalProfile: undefined,
      isGettingRemovalProfile: true,
    };
  }

  return {
    removalProfile: removalProfile as RemovalProfile,
    isGettingRemovalProfile: false,
  };
};

export default useGetPageRemovalProfile;
