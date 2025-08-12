import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import SingleUpgradeProfileForm from "../SingleUpgradeProfileForm";

const UpgradeProfileAddSidePanel: FC = () => (
  <SidePanel.Body title="Add upgrade profile">
    <SingleUpgradeProfileForm action="add" />
  </SidePanel.Body>
);

export default UpgradeProfileAddSidePanel;
