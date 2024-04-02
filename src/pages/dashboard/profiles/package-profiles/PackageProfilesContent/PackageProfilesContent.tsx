import { FC, useState } from "react";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import {
  PackageProfile,
  PackageProfileList,
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
      <HeaderWithSearch onSearch={(searchText) => setSearch(searchText)} />
      <PackageProfileList
        packageProfiles={packageProfiles}
        searchText={search}
      />
    </>
  );
};

export default PackageProfilesContent;
