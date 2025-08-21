import usePageParams from "@/hooks/usePageParams";
import { useGetSecurityProfile } from ".";
import type { SecurityProfile } from "../types";

const useGetPageSecurityProfile = ():
  | {
      securityProfile: SecurityProfile;
      isGettingSecurityProfile: false;
    }
  | {
      securityProfile: undefined;
      isGettingSecurityProfile: true;
    } => {
  const { profile: securityProfileId } = usePageParams();

  const { isGettingSecurityProfile, securityProfile, securityProfileError } =
    useGetSecurityProfile(parseInt(securityProfileId));

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

export default useGetPageSecurityProfile;
