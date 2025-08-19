import SidePanel from "@/components/layout/SidePanel";
import type { AccessGroup } from "@/features/access-groups";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useUpgradeProfiles } from "../../hooks";
import type { UpgradeProfile } from "../../types";

export interface UpgradeProfileSidePanelComponentProps {
  upgradeProfile: UpgradeProfile;
  accessGroups: AccessGroup[] | undefined;
  disableQuery: () => void;
  enableQuery: () => void;
}

interface UpgradeProfileSidePanelProps {
  readonly Component: FC<UpgradeProfileSidePanelComponentProps>;
  readonly accessGroupsQueryEnabled?: boolean;
}

const UpgradeProfileSidePanel: FC<UpgradeProfileSidePanelProps> = ({
  Component,
  accessGroupsQueryEnabled,
}) => {
  const { upgradeProfile: upgradeProfileId } = usePageParams();

  const {
    value: queryEnabled,
    setTrue: enableQuery,
    setFalse: disableQuery,
  } = useBoolean(true);

  const { getUpgradeProfilesQuery } = useUpgradeProfiles();
  const {
    data: getUpgradeProfilesQueryResponse,
    isPending: isGettingUpgradeProfiles,
    error: upgradeProfilesError,
  } = getUpgradeProfilesQuery(undefined, { enabled: queryEnabled });

  const { getAccessGroupQuery } = useRoles();
  const {
    data: accessGroupsData,
    isPending: isGettingAccessGroups,
    error: accessGroupsError,
  } = getAccessGroupQuery(undefined, { enabled: accessGroupsQueryEnabled });

  if (upgradeProfilesError) {
    throw upgradeProfilesError;
  }

  if (
    isGettingUpgradeProfiles ||
    (accessGroupsQueryEnabled && isGettingAccessGroups && !accessGroupsError)
  ) {
    return <SidePanel.LoadingState />;
  }

  const upgradeProfile = getUpgradeProfilesQueryResponse.data.find(
    ({ id }) => id === upgradeProfileId,
  );

  if (!upgradeProfile) {
    throw new Error("The upgrade profile could not be found.");
  }

  return (
    <Component
      upgradeProfile={upgradeProfile}
      accessGroups={accessGroupsData?.data}
      disableQuery={disableQuery}
      enableQuery={enableQuery}
    />
  );
};

export default UpgradeProfileSidePanel;
