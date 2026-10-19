import { ProfileTypes } from "@/features/profiles";
import {
  useGetPageUpgradeProfile,
  useUpgradeProfiles,
} from "@/features/upgrade-profiles";
import type { FC } from "react";
import SupportProfileSidePanel from "../SupportProfileSidePanel";
import SupportProfilesPanel from "./SupportProfilesPanel";

const UpgradeProfileDetails: FC = () => {
  const { upgradeProfile } = useGetPageUpgradeProfile();

  return (
    <SupportProfileSidePanel
      type={ProfileTypes.upgrade}
      profile={upgradeProfile}
    />
  );
};

const SupportUpgradeProfiles: FC = () => {
  const { getUpgradeProfilesQuery } = useUpgradeProfiles();
  const { data, isPending, error } = getUpgradeProfilesQuery();

  return (
    <SupportProfilesPanel
      type={ProfileTypes.upgrade}
      profiles={data?.data ?? []}
      isPending={isPending}
      error={error}
      details={<UpgradeProfileDetails />}
    />
  );
};

export default SupportUpgradeProfiles;
