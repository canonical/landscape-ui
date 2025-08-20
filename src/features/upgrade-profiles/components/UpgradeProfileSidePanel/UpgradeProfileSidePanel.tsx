import SidePanel from "@/components/layout/SidePanel";
import type { AccessGroup } from "@/features/access-groups";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { useGetUpgradeProfile } from "../../api";
import type { UpgradeProfile } from "../../types";

export interface UpgradeProfileSidePanelComponentProps {
  upgradeProfile: UpgradeProfile;
  accessGroups: AccessGroup[] | undefined;
}

interface UpgradeProfileSidePanelProps {
  readonly Component: FC<UpgradeProfileSidePanelComponentProps>;
  readonly accessGroupsQueryEnabled?: boolean;
}

const UpgradeProfileSidePanel: FC<UpgradeProfileSidePanelProps> = ({
  Component,
  accessGroupsQueryEnabled,
}) => {
  const { profile: upgradeProfileId } = usePageParams();

  const { isGettingUpgradeProfile, upgradeProfile, upgradeProfileError } =
    useGetUpgradeProfile(parseInt(upgradeProfileId));

  const { getAccessGroupQuery } = useRoles();
  const {
    data: accessGroupsData,
    isPending: isGettingAccessGroups,
    error: accessGroupsError,
  } = getAccessGroupQuery(undefined, { enabled: accessGroupsQueryEnabled });

  if (
    isGettingUpgradeProfile ||
    (accessGroupsQueryEnabled && isGettingAccessGroups && !accessGroupsError)
  ) {
    return <SidePanel.LoadingState />;
  }

  if (!upgradeProfile) {
    throw upgradeProfileError;
  }

  return (
    <Component
      upgradeProfile={upgradeProfile}
      accessGroups={accessGroupsData?.data}
    />
  );
};

export default UpgradeProfileSidePanel;
