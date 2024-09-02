import { FC } from "react";
import {
  PackageProfile,
  PackageProfileHeader,
  PackageProfileList,
} from "@/features/package-profiles";

interface PackageProfilesContentProps {
  packageProfiles: PackageProfile[] | undefined;
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
