import SidePanel from "@/components/layout/SidePanel";
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
    return <SidePanel.LoadingState />;
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
