import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import SingleRemovalProfileForm from "../SingleRemovalProfileForm";

const RemovalProfileAddSidePanel: FC = () => (
  <SidePanel.Body title="Add removal profile">
    <SingleRemovalProfileForm action="add" />
  </SidePanel.Body>
);

export default RemovalProfileAddSidePanel;
