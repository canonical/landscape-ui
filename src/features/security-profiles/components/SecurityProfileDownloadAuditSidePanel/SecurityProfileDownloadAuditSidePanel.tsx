import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import useGetPageSecurityProfile from "../../api/useGetPageSecurityProfile";
import SecurityProfileDownloadAuditForm from "./components/SecurityProfileDownloadAuditForm";

const SecurityProfileDownloadAuditSidePanel: FC = () => {
  const { securityProfile, isGettingSecurityProfile } =
    useGetPageSecurityProfile();

  if (isGettingSecurityProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>
        Download audit for {securityProfile.title} security profile
      </SidePanel.Header>
      <SidePanel.Content>
        <SecurityProfileDownloadAuditForm securityProfile={securityProfile} />
      </SidePanel.Content>
    </>
  );
};

export default SecurityProfileDownloadAuditSidePanel;
