import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel";
import useGetPageRepositoryProfile from "../../api/useGetPageRepositoryProfile";
import RepositoryProfileForm from "../RepositoryProfileForm";

interface RepositoryProfileManageSidePanelProps {
  readonly action: "add" | "edit";
}

const RepositoryProfileManageSidePanel: FC<
  RepositoryProfileManageSidePanelProps
> = ({ action }) => {
  const { repositoryProfile, isGettingRepositoryProfile } =
    useGetPageRepositoryProfile();

  if (isGettingRepositoryProfile) {
    return <SidePanel.LoadingState />;
  }

  const title =
    action === "edit"
      ? `Edit ${repositoryProfile.title}`
      : "Add repository profile";

  return (
    <>
      <SidePanel.Header>{title}</SidePanel.Header>
      <SidePanel.Content>
        <RepositoryProfileForm action={action} profile={repositoryProfile} />
      </SidePanel.Content>
    </>
  );
};

export default RepositoryProfileManageSidePanel;
