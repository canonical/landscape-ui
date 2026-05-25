import usePageParams from "@/hooks/usePageParams";
import { useGetRemovalProfile } from "./useGetRemovalProfile";
import type { RemovalProfile } from "../types";

export const useGetPageRemovalProfile = ():
  | {
      removalProfile: RemovalProfile;
      isGettingRemovalProfile: false;
    }
  | { removalProfile: undefined; isGettingRemovalProfile: true } => {
  const { name: removalProfileId } = usePageParams();

  const { isGettingRemovalProfile, removalProfile, removalProfileError } =
    useGetRemovalProfile(parseInt(removalProfileId), {
      enabled: !!removalProfileId,
    });

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
