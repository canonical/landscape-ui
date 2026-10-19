import {
  useGetPagePackageProfile,
  usePackageProfiles,
} from "@/features/package-profiles";
import { ProfileTypes } from "@/features/profiles";
import type { FC } from "react";
import SupportProfileSidePanel from "../SupportProfileSidePanel";
import SupportProfilesPanel from "./SupportProfilesPanel";

const PackageProfileDetails: FC = () => {
  const { packageProfile } = useGetPagePackageProfile();

  return (
    <SupportProfileSidePanel
      type={ProfileTypes.package}
      profile={packageProfile}
    />
  );
};

const SupportPackageProfiles: FC = () => {
  const { getPackageProfilesQuery } = usePackageProfiles();
  const { data, isPending, error } = getPackageProfilesQuery();

  return (
    <SupportProfilesPanel
      type={ProfileTypes.package}
      profiles={data?.data.result ?? []}
      isPending={isPending}
      error={error}
      details={<PackageProfileDetails />}
    />
  );
};

export default SupportPackageProfiles;
