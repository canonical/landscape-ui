import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useUpgradeProfiles } from "../../hooks";
import type { UpgradeProfile } from "../../types";

export interface UpgradeProfileSidePanelComponentProps {
  upgradeProfile: UpgradeProfile;
  disableQuery: () => void;
  enableQuery: () => void;
}

interface UpgradeProfileSidePanelProps {
  readonly Component: FC<UpgradeProfileSidePanelComponentProps>;
}

const UpgradeProfileSidePanel: FC<UpgradeProfileSidePanelProps> = ({
  Component,
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

  if (upgradeProfilesError) {
    throw upgradeProfilesError;
  }

  if (isGettingUpgradeProfiles) {
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
      disableQuery={disableQuery}
      enableQuery={enableQuery}
    />
  );
};

export default UpgradeProfileSidePanel;
