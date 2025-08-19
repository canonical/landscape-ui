import SidePanel from "@/components/layout/SidePanel";
import type { AccessGroup } from "@/features/access-groups";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { useRemovalProfiles } from "../../hooks";
import type { RemovalProfile } from "../../types";

export interface RemovalProfileSidePanelComponentProps {
  removalProfile: RemovalProfile;
  accessGroups: AccessGroup[] | undefined;
}

interface RemovalProfileSidePanelProps {
  readonly Component: FC<RemovalProfileSidePanelComponentProps>;
  readonly accessGroupsQueryEnabled?: boolean;
}

const RemovalProfileSidePanel: FC<RemovalProfileSidePanelProps> = ({
  Component,
  accessGroupsQueryEnabled,
}) => {
  const { removalProfile: removalProfileId } = usePageParams();

  const { getRemovalProfilesQuery } = useRemovalProfiles();
  const {
    data: getRemovalProfilesQueryResponse,
    isPending: isGettingRemovalProfiles,
    error: removalProfilesError,
  } = getRemovalProfilesQuery();

  const { getAccessGroupQuery } = useRoles();
  const {
    data: accessGroupsData,
    isPending: isGettingAccessGroups,
    error: accessGroupsError,
  } = getAccessGroupQuery(undefined, { enabled: accessGroupsQueryEnabled });

  if (removalProfilesError) {
    throw removalProfilesError;
  }

  if (
    isGettingRemovalProfiles ||
    (accessGroupsQueryEnabled && isGettingAccessGroups && !accessGroupsError)
  ) {
    return <SidePanel.LoadingState />;
  }

  const removalProfile = getRemovalProfilesQueryResponse.data.find(
    ({ id }) => id === removalProfileId,
  );

  if (!removalProfile) {
    throw new Error("The removal profile could not be found.");
  }

  return (
    <Component
      removalProfile={removalProfile}
      accessGroups={accessGroupsData?.data}
    />
  );
};

export default RemovalProfileSidePanel;
