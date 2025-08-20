import SidePanel from "@/components/layout/SidePanel";
import type { AccessGroup } from "@/features/access-groups";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { useGetSecurityProfile } from "../../api";
import type { SecurityProfile } from "../../types";

export interface SecurityProfileSidePanelComponentProps {
  securityProfile: SecurityProfile;
  accessGroups: AccessGroup[] | undefined;
}

interface SecurityProfileSidePanelProps {
  readonly Component: FC<SecurityProfileSidePanelComponentProps>;
  readonly accessGroupsQueryEnabled?: boolean;
}

const SecurityProfileSidePanel: FC<SecurityProfileSidePanelProps> = ({
  Component,
  accessGroupsQueryEnabled,
}) => {
  const { securityProfile: securityProfileId } = usePageParams();

  const { isGettingSecurityProfile, securityProfile, securityProfileError } =
    useGetSecurityProfile(securityProfileId);

  const { getAccessGroupQuery } = useRoles();
  const {
    data: accessGroupsData,
    isPending: isGettingAccessGroups,
    error: accessGroupsError,
  } = getAccessGroupQuery(undefined, { enabled: accessGroupsQueryEnabled });

  if (
    isGettingSecurityProfile ||
    (accessGroupsQueryEnabled && isGettingAccessGroups && !accessGroupsError)
  ) {
    return <SidePanel.LoadingState />;
  }

  if (!securityProfile) {
    throw securityProfileError;
  }

  return (
    <Component
      securityProfile={securityProfile}
      accessGroups={accessGroupsData?.data}
    />
  );
};

export default SecurityProfileSidePanel;
