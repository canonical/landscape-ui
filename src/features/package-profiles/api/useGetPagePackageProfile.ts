import usePageParams from "@/hooks/usePageParams";
import { useGetPackageProfile } from "./useGetPackageProfile";
import type { PackageProfile } from "../types";

export const useGetPagePackageProfile = ():
  | { packageProfile: PackageProfile; isGettingPackageProfile: false }
  | { packageProfile: undefined; isGettingPackageProfile: true } => {
  const { name: packageProfileName } = usePageParams();

  const { packageProfile, isGettingPackageProfile, packageProfileError } =
    useGetPackageProfile(packageProfileName, { enabled: !!packageProfileName });

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
