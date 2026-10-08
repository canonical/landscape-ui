import { ProfileTypes } from "@/features/profiles";
import {
  useGetPageUpgradeProfile,
  useUpgradeProfiles,
} from "@/features/upgrade-profiles";
import type { FC } from "react";
import SupportProfilesPanel from "./SupportProfilesPanel";

const SupportUpgradeProfiles: FC = () => {
  const { getUpgradeProfilesQuery } = useUpgradeProfiles();
  const { data, isPending, error } = getUpgradeProfilesQuery();
  const { upgradeProfile } = useGetPageUpgradeProfile();

  return (
    <SupportProfilesPanel
      type={ProfileTypes.upgrade}
      profiles={data?.data ?? []}
      isPending={isPending}
      error={error}
      profile={upgradeProfile}
    />
  );
};

export default SupportUpgradeProfiles;
