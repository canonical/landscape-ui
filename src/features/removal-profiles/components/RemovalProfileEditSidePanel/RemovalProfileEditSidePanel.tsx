import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import { useGetPageRemovalProfile } from "../../api/useGetPageRemovalProfile";
import SingleRemovalProfileForm from "../SingleRemovalProfileForm";

const RemovalProfileEditSidePanel: FC = () => {
  const { removalProfile, isGettingRemovalProfile } =
    useGetPageRemovalProfile();

  if (isGettingRemovalProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Edit {removalProfile.title}</SidePanel.Header>
      <SidePanel.Content>
        <SingleRemovalProfileForm action="edit" profile={removalProfile} />
      </SidePanel.Content>
    </>
  );
};

export default RemovalProfileEditSidePanel;
