import SidePanel from "@/components/layout/SidePanel";
import type { AccessGroup } from "@/features/access-groups";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { useGetRebootProfiles } from "../../api";
import type { RebootProfile } from "../../types";

export interface RebootProfileSidePanelComponentProps {
  rebootProfile: RebootProfile;
  accessGroups: AccessGroup[] | undefined;
}

interface RebootProfileSidePanelProps {
  readonly Component: FC<RebootProfileSidePanelComponentProps>;
  readonly accessGroupsQueryEnabled?: boolean;
}

const RebootProfileSidePanel: FC<RebootProfileSidePanelProps> = ({
  Component,
  accessGroupsQueryEnabled,
}) => {
  const { rebootProfile: rebootProfileId } = usePageParams();

  const {
    rebootProfiles,
    isPending: isGettingRebootProfiles,
    rebootProfilesError,
  } = useGetRebootProfiles();

  const { getAccessGroupQuery } = useRoles();
  const {
    data: accessGroupsData,
    isPending: isGettingAccessGroups,
    error: accessGroupsError,
  } = getAccessGroupQuery(undefined, { enabled: accessGroupsQueryEnabled });

  if (rebootProfileId === -1) {
    return;
  }

  if (rebootProfilesError) {
    throw rebootProfilesError;
  }

  if (accessGroupsError) {
    throw accessGroupsError;
  }

  if (
    isGettingRebootProfiles ||
    (isGettingAccessGroups && accessGroupsQueryEnabled)
  ) {
    return <SidePanel.LoadingState />;
  }

  const rebootProfile = rebootProfiles.find(({ id }) => id === rebootProfileId);

  if (!rebootProfile) {
    throw new Error("The reboot profile could not be found.");
  }

  return (
    <Component
      rebootProfile={rebootProfile}
      accessGroups={accessGroupsData?.data}
    />
  );
};

export default RebootProfileSidePanel;
