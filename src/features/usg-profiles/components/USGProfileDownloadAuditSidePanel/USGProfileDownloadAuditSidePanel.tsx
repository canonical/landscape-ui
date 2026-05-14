import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import { useGetPageUsgProfile } from "../../api/useGetPageUsgProfile";
import USGProfileDownloadAuditForm from "./components/USGProfileDownloadAuditForm";

const USGProfileDownloadAuditSidePanel: FC = () => {
  const { usgProfile, isGettingUsgProfile } = useGetPageUsgProfile();

  if (isGettingUsgProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>
        Download audit for {usgProfile.title} USG profile
      </SidePanel.Header>
      <SidePanel.Content>
        <USGProfileDownloadAuditForm usgProfile={usgProfile} />
      </SidePanel.Content>
    </>
  );
};

export default USGProfileDownloadAuditSidePanel;
