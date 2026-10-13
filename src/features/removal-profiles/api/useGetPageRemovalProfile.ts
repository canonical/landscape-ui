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
  // The page param may hold another profile type's name: only a whole id is asked for.
  const id = /^\d+$/.test(removalProfileId) ? Number(removalProfileId) : NaN;

  const { isGettingRemovalProfile, removalProfile, removalProfileError } =
    useGetRemovalProfile(id, { enabled: !Number.isNaN(id) });

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
