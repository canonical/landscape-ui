import usePageParams from "@/hooks/usePageParams";
import { useGetSecurityProfile } from "./useGetSecurityProfile";
import type { SecurityProfile } from "../types";

export const useGetPageSecurityProfile = ():
  | {
      securityProfile: SecurityProfile;
      isGettingSecurityProfile: false;
    }
  | {
      securityProfile: undefined;
      isGettingSecurityProfile: true;
    } => {
  const { name: securityProfileId } = usePageParams();

  const { isGettingSecurityProfile, securityProfile, securityProfileError } =
    useGetSecurityProfile(parseInt(securityProfileId), {
      enabled: !!securityProfileId,
    });

  if (securityProfileError) {
    throw securityProfileError;
  }

  if (isGettingSecurityProfile) {
    return {
      securityProfile: undefined,
      isGettingSecurityProfile: true,
    };
  }

  return {
    securityProfile: securityProfile as SecurityProfile,
    isGettingSecurityProfile: false,
  };
};
