import SidePanel from "@/components/layout/SidePanel";
import type { AccessGroup } from "@/features/access-groups";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import useGetRebootProfile from "../../api/useGetRebootProfile";
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

  const { isGettingRebootProfile, rebootProfile, rebootProfileError } =
    useGetRebootProfile({ id: rebootProfileId });

  const { getAccessGroupQuery } = useRoles();
  const {
    data: accessGroupsData,
    isPending: isGettingAccessGroups,
    error: accessGroupsError,
  } = getAccessGroupQuery(undefined, { enabled: accessGroupsQueryEnabled });

  if (
    isGettingRebootProfile ||
    (accessGroupsQueryEnabled && isGettingAccessGroups && !accessGroupsError)
  ) {
    return <SidePanel.LoadingState />;
  }

  if (!rebootProfile) {
    throw rebootProfileError;
  }

  return (
    <Component
      rebootProfile={rebootProfile}
      accessGroups={accessGroupsData?.data}
    />
  );
};

export default RebootProfileSidePanel;
