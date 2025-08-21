import usePageParams from "@/hooks/usePageParams";
import { useGetPackageProfile } from ".";
import type { PackageProfile } from "../types";

const useGetPagePackageProfile = ():
  | { packageProfile: PackageProfile; isGettingPackageProfile: false }
  | { packageProfile: undefined; isGettingPackageProfile: true } => {
  const { profile: packageProfileName } = usePageParams();

  const { packageProfile, isGettingPackageProfile, packageProfileError } =
    useGetPackageProfile(packageProfileName);

  if (packageProfileError) {
    throw packageProfileError;
  }

  if (isGettingPackageProfile) {
    return {
      packageProfile: undefined,
      isGettingPackageProfile: true,
    };
  }

  return {
    packageProfile: packageProfile as PackageProfile,
    isGettingPackageProfile: false,
  };
};

export default useGetPagePackageProfile;
