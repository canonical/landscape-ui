import { FC, useState } from "react";
import {
  PackageProfile,
  PackageProfileList,
  PackageProfilesHeader,
} from "@/features/package-profiles";

interface PackageProfilesContentProps {
  packageProfiles: PackageProfile[] | undefined;
}

const PackageProfilesContent: FC<PackageProfilesContentProps> = ({
  packageProfiles = [],
}) => {
  const [search, setSearch] = useState("");

  return (
    <>
      <PackageProfilesHeader onSearch={(searchText) => setSearch(searchText)} />
      <PackageProfileList
        packageProfiles={packageProfiles}
        searchText={search}
      />
    </>
  );
};

export default PackageProfilesContent;
