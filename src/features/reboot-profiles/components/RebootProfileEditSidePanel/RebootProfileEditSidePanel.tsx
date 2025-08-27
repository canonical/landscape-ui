import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import useGetPageRebootProfile from "../../api/useGetPageRebootProfile";
import RebootProfilesForm from "../RebootProfilesForm";

const RebootProfileEditSidePanel: FC = () => {
  const { rebootProfile, isGettingRebootProfile } = useGetPageRebootProfile();

  if (isGettingRebootProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Edit {rebootProfile.title}</SidePanel.Header>
      <SidePanel.Content>
        <RebootProfilesForm action="edit" profile={rebootProfile} />;
      </SidePanel.Content>
    </>
  );
};

export default RebootProfileEditSidePanel;
