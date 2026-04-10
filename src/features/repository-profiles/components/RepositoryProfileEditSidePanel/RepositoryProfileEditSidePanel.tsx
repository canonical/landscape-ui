import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel";
import { useGetPageRepositoryProfile } from "../../api/useGetPageRepositoryProfile";
import RepositoryProfileForm from "../RepositoryProfileForm";

const RepositoryProfileEditSidePanel: FC = () => {
  const { repositoryProfile, isGettingRepositoryProfile } =
    useGetPageRepositoryProfile();

  if (isGettingRepositoryProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Edit {repositoryProfile.title}</SidePanel.Header>
      <SidePanel.Content>
        <RepositoryProfileForm action={"edit"} profile={repositoryProfile} />
      </SidePanel.Content>
    </>
  );
};

export default RepositoryProfileEditSidePanel;
