import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetRebootProfiles } from "../../api";
import RebootProfilesForm from "../RebootProfilesForm";

interface RebootProfileEditSidePanelProps {
  readonly hasBackButton?: boolean;
}

const RebootProfileEditSidePanel: FC<RebootProfileEditSidePanelProps> = ({
  hasBackButton,
}) => {
  const { rebootProfile: rebootProfileId } = usePageParams();

  const { rebootProfiles, isPending, error } = useGetRebootProfiles();

  if (isPending) {
    return <SidePanel.LoadingState />;
  }

  if (error) {
    throw error;
  }

  const rebootProfile = rebootProfiles.find(({ id }) => id === rebootProfileId);

  if (!rebootProfile) {
    throw new Error("The reboot profile could not be found.");
  }

  return (
    <SidePanel.Body title={`Edit ${rebootProfile.title}`}>
      <RebootProfilesForm
        action="edit"
        profile={rebootProfile}
        hasBackButton={hasBackButton}
      />
      ;
    </SidePanel.Body>
  );
};

export default RebootProfileEditSidePanel;
