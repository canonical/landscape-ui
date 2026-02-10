import type { FC } from "react";
import type { PackageProfile } from "../../types";
import PackageProfileHeader from "../PackageProfileHeader";
import PackageProfileList from "../PackageProfileList";

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
