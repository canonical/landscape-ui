import { ProfileTypes } from "@/features/profiles";
import {
  useGetPageRemovalProfile,
  useRemovalProfiles,
} from "@/features/removal-profiles";
import type { FC } from "react";
import SupportProfileSidePanel from "../SupportProfileSidePanel";
import SupportProfilesPanel from "./SupportProfilesPanel";

const RemovalProfileDetails: FC = () => {
  const { removalProfile } = useGetPageRemovalProfile();

  return (
    <SupportProfileSidePanel
      type={ProfileTypes.removal}
      profile={removalProfile}
    />
  );
};

const SupportRemovalProfiles: FC = () => {
  const { getRemovalProfilesQuery } = useRemovalProfiles();
  const { data, isPending, error } = getRemovalProfilesQuery();

  return (
    <SupportProfilesPanel
      type={ProfileTypes.removal}
      profiles={data?.data ?? []}
      isPending={isPending}
      error={error}
      details={<RemovalProfileDetails />}
    />
  );
};

export default SupportRemovalProfiles;
