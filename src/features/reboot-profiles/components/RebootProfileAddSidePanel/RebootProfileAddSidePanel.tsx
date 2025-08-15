import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import RebootProfilesForm from "../RebootProfilesForm";

const RebootProfileAddSidePanel: FC = () => (
  <>
    <SidePanel.Header>Add reboot profile</SidePanel.Header>

    <SidePanel.Content>
      <RebootProfilesForm action="add" />
    </SidePanel.Content>
  </>
);

export default RebootProfileAddSidePanel;
