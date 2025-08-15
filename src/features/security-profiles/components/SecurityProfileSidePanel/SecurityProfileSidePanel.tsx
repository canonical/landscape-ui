import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetSecurityProfiles } from "../../api";
import type { SecurityProfile } from "../../types";

export interface SecurityProfileSidePanelComponentProps {
  securityProfile: SecurityProfile;
}

interface SecurityProfileSidePanelProps {
  readonly Component: FC<SecurityProfileSidePanelComponentProps>;
}

const SecurityProfileSidePanel: FC<SecurityProfileSidePanelProps> = ({
  Component,
}) => {
  const { securityProfile: securityProfileId } = usePageParams();

  const { isSecurityProfilesLoading, securityProfiles, securityProfilesError } =
    useGetSecurityProfiles();

  if (isSecurityProfilesLoading) {
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
  } else {
    return <Component securityProfile={securityProfile} />;
  }
};

export default SecurityProfileSidePanel;
