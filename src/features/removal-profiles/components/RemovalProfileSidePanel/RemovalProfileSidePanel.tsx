import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useRemovalProfiles } from "../../hooks";
import type { RemovalProfile } from "../../types";

export interface RemovalProfileSidePanelComponentProps {
  removalProfile: RemovalProfile;
}

interface RemovalProfileSidePanelProps {
  readonly Component: FC<RemovalProfileSidePanelComponentProps>;
}

const RemovalProfileSidePanel: FC<RemovalProfileSidePanelProps> = ({
  Component,
}) => {
  const { removalProfile: removalProfileId } = usePageParams();

  const { getRemovalProfilesQuery } = useRemovalProfiles();
  const {
    data: getRemovalProfilesQueryResponse,
    isPending: isGettingRemovalProfiles,
    error: removalProfilesError,
  } = getRemovalProfilesQuery();

  if (removalProfilesError) {
    throw removalProfilesError;
  }

  if (isGettingRemovalProfiles) {
    return <SidePanel.LoadingState />;
  }

  const removalProfile = getRemovalProfilesQueryResponse.data.find(
    ({ id }) => id === removalProfileId,
  );

  if (!removalProfile) {
    throw new Error("The removal profile could not be found.");
  }

  return <Component removalProfile={removalProfile} />;
};

export default RemovalProfileSidePanel;
