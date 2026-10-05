import { ProfileTypes } from "@/features/profiles";
import {
  useGetPageRemovalProfile,
  useRemovalProfiles,
} from "@/features/removal-profiles";
import type { FC } from "react";
import SupportProfilesPanel from "./SupportProfilesPanel";

const SupportRemovalProfiles: FC = () => {
  const { getRemovalProfilesQuery } = useRemovalProfiles();
  const { data, isPending } = getRemovalProfilesQuery();
  const { removalProfile } = useGetPageRemovalProfile();

  return (
    <SupportProfilesPanel
      type={ProfileTypes.removal}
      profiles={data?.data ?? []}
      isPending={isPending}
      profile={removalProfile}
    />
  );
};

export default SupportRemovalProfiles;
