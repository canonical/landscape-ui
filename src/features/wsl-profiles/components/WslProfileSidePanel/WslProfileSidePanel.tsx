import SidePanel from "@/components/layout/SidePanel";
import type { AccessGroup } from "@/features/access-groups";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useGetWslProfile } from "../../api";
import type { WslProfile } from "../../types";

export interface WslProfileSidePanelComponentProps {
  wslProfile: WslProfile;
  accessGroups: AccessGroup[] | undefined;
  disableQuery: () => void;
  enableQuery: () => void;
}

interface WslProfileSidePanelProps {
  readonly Component: FC<WslProfileSidePanelComponentProps>;
  readonly accessGroupsQueryEnabled?: boolean;
}

const WslProfileSidePanel: FC<WslProfileSidePanelProps> = ({
  Component,
  accessGroupsQueryEnabled,
}) => {
  const { wslProfile: wslProfileName } = usePageParams();

  const {
    value: queryEnabled,
    setTrue: enableQuery,
    setFalse: disableQuery,
  } = useBoolean(true);

  const { wslProfile, isGettingWslProfile, wslProfileError } = useGetWslProfile(
    { profile_name: wslProfileName },
    { enabled: queryEnabled },
  );

  const { getAccessGroupQuery } = useRoles();
  const {
    data: accessGroupsData,
    isPending: isGettingAccessGroups,
    error: accessGroupsError,
  } = getAccessGroupQuery(undefined, { enabled: accessGroupsQueryEnabled });

  if (accessGroupsError) {
    throw accessGroupsError;
  }

  if (
    isGettingWslProfile ||
    (isGettingAccessGroups && accessGroupsQueryEnabled)
  ) {
    return <SidePanel.LoadingState />;
  }

  if (!wslProfile) {
    throw wslProfileError;
  }

  return (
    <Component
      wslProfile={wslProfile}
      accessGroups={accessGroupsData?.data}
      disableQuery={disableQuery}
      enableQuery={enableQuery}
    />
  );
};

export default WslProfileSidePanel;
