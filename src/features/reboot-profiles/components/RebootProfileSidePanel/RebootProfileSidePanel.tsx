import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetRebootProfiles } from "../../api";
import type { RebootProfile } from "../../types";

export interface RebootProfileSidePanelComponentProps {
  rebootProfile: RebootProfile;
}

interface RebootProfileSidePanelProps {
  readonly Component: FC<RebootProfileSidePanelComponentProps>;
}

const RebootProfileSidePanel: FC<RebootProfileSidePanelProps> = ({
  Component,
}) => {
  const { rebootProfile: rebootProfileId } = usePageParams();

  const { rebootProfiles, isPending, rebootProfilesError } =
    useGetRebootProfiles();

  if (isPending) {
    return <SidePanel.LoadingState />;
  }

  if (rebootProfilesError) {
    throw rebootProfilesError;
  }

  const rebootProfile = rebootProfiles.find(({ id }) => id === rebootProfileId);

  if (!rebootProfile) {
    throw new Error("The reboot profile could not be found.");
  }

  return <Component rebootProfile={rebootProfile} />;
};

export default RebootProfileSidePanel;
