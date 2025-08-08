import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import RebootProfilesForm from "../RebootProfilesForm";

const RebootProfileAddSidePanel: FC = () => {
  return (
    <SidePanel.Body title="Add reboot profile">
      <RebootProfilesForm action="add" />
    </SidePanel.Body>
  );
};

export default RebootProfileAddSidePanel;
