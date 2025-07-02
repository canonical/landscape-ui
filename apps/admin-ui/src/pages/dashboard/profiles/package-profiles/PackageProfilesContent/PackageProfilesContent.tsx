import type { FC } from "react";
import type { PackageProfile } from "@/features/package-profiles";
import {
  PackageProfileHeader,
  PackageProfileList,
} from "@/features/package-profiles";

interface PackageProfilesContentProps {
  readonly packageProfiles: PackageProfile[] | undefined;
}

const PackageProfilesContent: FC<PackageProfilesContentProps> = ({
  packageProfiles = [],
}) => {
  return (
    <>
      <PackageProfileHeader />
      <PackageProfileList packageProfiles={packageProfiles} />
    </>
  );
};

export default PackageProfilesContent;
