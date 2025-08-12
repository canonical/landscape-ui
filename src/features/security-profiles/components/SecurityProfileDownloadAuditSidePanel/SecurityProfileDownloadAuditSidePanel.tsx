import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetSecurityProfiles } from "../../api";
import SecurityProfileDownloadAuditForm from "../SecurityProfileDownloadAuditForm";

interface SecurityProfileDownloadAuditSidePanelProps {
  readonly hasBackButton?: boolean;
}

const SecurityProfileDownloadAuditSidePanel: FC<
  SecurityProfileDownloadAuditSidePanelProps
> = ({ hasBackButton }) => {
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
  }

  return (
    <SidePanel.Body
      title={`Download audit for ${securityProfile.title} security profile`}
    >
      <SecurityProfileDownloadAuditForm
        profileId={securityProfile.id}
        hasBackButton={hasBackButton}
      />
      ;
    </SidePanel.Body>
  );
};

export default SecurityProfileDownloadAuditSidePanel;
