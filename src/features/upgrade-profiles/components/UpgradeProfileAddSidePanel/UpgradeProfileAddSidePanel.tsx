import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import SingleUpgradeProfileForm from "../SingleUpgradeProfileForm";

const UpgradeProfileAddSidePanel: FC = () => (
  <>
    <SidePanel.Header>Add upgrade profile</SidePanel.Header>
    <SidePanel.Content>
      <SingleUpgradeProfileForm action="add" />
    </SidePanel.Content>
  </>
);

export default UpgradeProfileAddSidePanel;
