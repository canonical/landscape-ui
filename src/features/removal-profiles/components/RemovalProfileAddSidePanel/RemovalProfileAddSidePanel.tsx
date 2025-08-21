import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import SingleRemovalProfileForm from "../SingleRemovalProfileForm";

const RemovalProfileAddSidePanel: FC = () => (
  <>
    <SidePanel.Header>Add removal profile</SidePanel.Header>
    <SidePanel.Content>
      <SingleRemovalProfileForm action="add" />
    </SidePanel.Content>
  </>
);

export default RemovalProfileAddSidePanel;
