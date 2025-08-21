import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import useRebootProfileSidePanel from "../../api/useGetPageRebootProfile";
import RebootProfilesForm from "../RebootProfilesForm";

const RebootProfileDuplicateSidePanel: FC = () => {
  const { rebootProfile, isGettingRebootProfile } = useRebootProfileSidePanel();

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
