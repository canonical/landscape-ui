import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import useGetPageUpgradeProfile from "../../api/useGetPageUpgradeProfile";
import SingleUpgradeProfileForm from "../SingleUpgradeProfileForm";

const UpgradeProfileEditSidePanel: FC = () => {
  const { upgradeProfile, isGettingUpgradeProfile } =
    useGetPageUpgradeProfile();

  if (isGettingUpgradeProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>
        Edit &quot;{upgradeProfile.title}&quot; profile
      </SidePanel.Header>
      <SidePanel.Content>
        <SingleUpgradeProfileForm action="edit" profile={upgradeProfile} />;
      </SidePanel.Content>
    </>
  );
};

export default UpgradeProfileEditSidePanel;
