import LoadingState from "@/components/layout/LoadingState";
import { LocalSidePanelBody } from "@/components/layout/LocalSidePanel";
import type { FC } from "react";
import { useGetRebootProfiles } from "../../api";
import RebootProfilesForm from "../RebootProfilesForm";

interface RebootProfilesSidePanelProps {
  readonly action: "duplicate" | "edit";
  readonly rebootProfileId: number | null;
}

const RebootProfilesSidePanel: FC<RebootProfilesSidePanelProps> = ({
  action,
  rebootProfileId,
}) => {
  const { rebootProfiles, isPending, error } = useGetRebootProfiles();

  if (isPending) {
    return (
      <LocalSidePanelBody>
        <LoadingState />
      </LocalSidePanelBody>
    );
  }

  if (error) {
    throw error;
  }

  const rebootProfile = rebootProfiles.find(({ id }) => id === rebootProfileId);

  if (!rebootProfile) {
    throw new Error("The reboot profile could not be found.");
  }

  return <RebootProfilesForm action={action} profile={rebootProfile} />;
};

export default RebootProfilesSidePanel;
