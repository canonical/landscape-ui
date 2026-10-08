import { ProfileTypes } from "@/features/profiles";
import {
  useGetPageRebootProfile,
  useGetRebootProfiles,
} from "@/features/reboot-profiles";
import type { FC } from "react";
import SupportProfileSidePanel from "../SupportProfileSidePanel";
import SupportProfilesPanel from "./SupportProfilesPanel";

const RebootProfileDetails: FC = () => {
  const { rebootProfile } = useGetPageRebootProfile();

  return (
    <SupportProfileSidePanel
      type={ProfileTypes.reboot}
      profile={rebootProfile}
    />
  );
};

const SupportRebootProfiles: FC = () => {
  const { rebootProfiles, isGettingRebootProfiles, rebootProfilesError } =
    useGetRebootProfiles();

  return (
    <SupportProfilesPanel
      type={ProfileTypes.reboot}
      profiles={rebootProfiles}
      isPending={isGettingRebootProfiles}
      error={rebootProfilesError}
      details={<RebootProfileDetails />}
    />
  );
};

export default SupportRebootProfiles;
