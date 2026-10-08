import { ProfileTypes } from "@/features/profiles";
import {
  useGetPageRebootProfile,
  useGetRebootProfiles,
} from "@/features/reboot-profiles";
import type { FC } from "react";
import SupportProfilesPanel from "./SupportProfilesPanel";

const SupportRebootProfiles: FC = () => {
  const { rebootProfiles, isGettingRebootProfiles, rebootProfilesError } =
    useGetRebootProfiles();
  const { rebootProfile } = useGetPageRebootProfile();

  return (
    <SupportProfilesPanel
      type={ProfileTypes.reboot}
      profiles={rebootProfiles}
      isPending={isGettingRebootProfiles}
      error={rebootProfilesError}
      profile={rebootProfile}
    />
  );
};

export default SupportRebootProfiles;
