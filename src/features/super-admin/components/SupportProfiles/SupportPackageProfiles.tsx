import {
  useGetPagePackageProfile,
  usePackageProfiles,
} from "@/features/package-profiles";
import { ProfileTypes } from "@/features/profiles";
import type { FC } from "react";
import SupportProfilesPanel from "./SupportProfilesPanel";

const SupportPackageProfiles: FC = () => {
  const { getPackageProfilesQuery } = usePackageProfiles();
  const { data, isPending } = getPackageProfilesQuery();
  const { packageProfile } = useGetPagePackageProfile();

  return (
    <SupportProfilesPanel
      type={ProfileTypes.package}
      profiles={data?.data.result ?? []}
      isPending={isPending}
      profile={packageProfile}
    />
  );
};

export default SupportPackageProfiles;
