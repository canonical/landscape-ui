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

  const { rebootProfiles, isPending, rebootProfilesError } =
    useGetRebootProfiles();

  if (isPending) {
    return <SidePanel.LoadingState />;
  }

  if (rebootProfilesError) {
    throw rebootProfilesError;
  }

  const rebootProfile = rebootProfiles.find(({ id }) => id === rebootProfileId);

  if (!rebootProfile) {
    throw new Error("The reboot profile could not be found.");
  }

  return (
    <>
      <SidePanel.Header>Edit {rebootProfile.title}</SidePanel.Header>

      <SidePanel.Content>
        <RebootProfilesForm
          action="edit"
          profile={rebootProfile}
          hasBackButton={hasBackButton}
        />
        ;
      </SidePanel.Content>
    </>
  );
};

export default RebootProfileEditSidePanel;
