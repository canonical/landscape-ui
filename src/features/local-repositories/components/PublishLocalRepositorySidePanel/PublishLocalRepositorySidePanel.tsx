import { type FC } from "react";
import SidePanel from "@/components/layout/SidePanel";
import { useGetPageLocalRepository } from "../../api/useGetPageLocalRepository";
import PublishLocalRepositoryForm from "./PublishLocalRepositoryForm";

const PublishLocalRepositorySidePanel: FC = () => {
  const { repository, isGettingRepository } = useGetPageLocalRepository();

  if (isGettingRepository) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Publish {repository.display_name}</SidePanel.Header>
      <SidePanel.Content>
        <PublishLocalRepositoryForm repository={repository} />
      </SidePanel.Content>
    </>
  );
};

export default PublishLocalRepositorySidePanel;
