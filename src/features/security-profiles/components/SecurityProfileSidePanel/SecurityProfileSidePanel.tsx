import SidePanel from "@/components/layout/SidePanel";
import type { AccessGroup } from "@/features/access-groups";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { useGetSecurityProfiles } from "../../api";
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

  const { isSecurityProfilesLoading, securityProfiles, securityProfilesError } =
    useGetSecurityProfiles();

  const { getAccessGroupQuery } = useRoles();
  const {
    data: accessGroupsData,
    isPending: isGettingAccessGroups,
    error: accessGroupsError,
  } = getAccessGroupQuery(undefined, { enabled: accessGroupsQueryEnabled });

  if (
    isSecurityProfilesLoading ||
    (accessGroupsQueryEnabled && isGettingAccessGroups && !accessGroupsError)
  ) {
    return <SidePanel.LoadingState />;
  }

  if (!securityProfiles) {
    throw securityProfilesError;
  }

  const securityProfile = securityProfiles.find(
    ({ id }) => id === securityProfileId,
  );

  if (!securityProfile) {
    throw new Error("The security profile could not be found.");
  }

  return (
    <Component
      securityProfile={securityProfile}
      accessGroups={accessGroupsData?.data}
    />
  );
};

export default SecurityProfileSidePanel;
