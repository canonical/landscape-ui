import SidePanel from "@/components/layout/SidePanel";
import type { AccessGroup } from "@/features/access-groups";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { useGetRemovalProfile } from "../../api";
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
  const { profile: removalProfileId } = usePageParams();

  const { isGettingRemovalProfile, removalProfile, removalProfileError } =
    useGetRemovalProfile(parseInt(removalProfileId));

  const { getAccessGroupQuery } = useRoles();
  const {
    data: accessGroupsData,
    isPending: isGettingAccessGroups,
    error: accessGroupsError,
  } = getAccessGroupQuery(undefined, { enabled: accessGroupsQueryEnabled });

  if (
    isGettingRemovalProfile ||
    (accessGroupsQueryEnabled && isGettingAccessGroups && !accessGroupsError)
  ) {
    return <SidePanel.LoadingState />;
  }

  if (!removalProfile) {
    throw removalProfileError;
  }

  return (
    <Component
      removalProfile={removalProfile}
      accessGroups={accessGroupsData?.data}
    />
  );
};

export default RemovalProfileSidePanel;
