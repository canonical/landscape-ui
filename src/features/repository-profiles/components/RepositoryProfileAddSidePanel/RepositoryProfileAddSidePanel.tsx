import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel";
import RepositoryProfileForm from "../RepositoryProfileForm";

const RepositoryProfileAddSidePanel: FC = () => {
  return (
    <>
      <SidePanel.Header>Add repository profile</SidePanel.Header>
      <SidePanel.Content>
        <RepositoryProfileForm action={"add"} />
      </SidePanel.Content>
    </>
  );
};

export default RepositoryProfileAddSidePanel;
