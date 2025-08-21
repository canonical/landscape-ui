import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import useGetPageRebootProfile from "../../api/useGetPageRebootProfile";
import RebootProfilesForm from "../RebootProfilesForm";

const RebootProfileDuplicateSidePanel: FC = () => {
  const { rebootProfile, isGettingRebootProfile } = useGetPageRebootProfile();

  if (isGettingRebootProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Duplicate {rebootProfile.title}</SidePanel.Header>
      <SidePanel.Content>
        <RebootProfilesForm action="duplicate" profile={rebootProfile} />
      </SidePanel.Content>
    </>
  );
};

export default RebootProfileDuplicateSidePanel;
