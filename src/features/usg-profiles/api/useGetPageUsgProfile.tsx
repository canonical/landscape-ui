import usePageParams from "@/hooks/usePageParams";
import { useGetUsgProfile } from "./useGetUsgProfile";
import type { USGProfile } from "../types";

export const useGetPageUsgProfile = ():
  | {
      usgProfile: USGProfile;
      isGettingUsgProfile: false;
    }
  | {
      usgProfile: undefined;
      isGettingUsgProfile: true;
    } => {
  const { name: usgProfileId } = usePageParams();

  const {
    isGettingUsgProfile: isGettingUsgProfile,
    usgProfile,
    usgProfileError,
  } = useGetUsgProfile(parseInt(usgProfileId), {
    enabled: !!usgProfileId,
  });

  if (usgProfileError) {
    throw usgProfileError;
  }

  if (isGettingUsgProfile) {
    return {
      usgProfile: undefined,
      isGettingUsgProfile: true,
    };
  }

  return {
    usgProfile: usgProfile as USGProfile,
    isGettingUsgProfile: false,
  };
};
