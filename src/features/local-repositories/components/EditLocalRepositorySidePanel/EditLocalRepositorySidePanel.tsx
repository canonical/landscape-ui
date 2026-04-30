import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel";
import { useGetPageLocalRepository } from "../../api/useGetPageLocalRepository";
import EditLocalRepositoryForm from "./EditLocalRepositoryForm";

const EditLocalRepositorySidePanel: FC = () => {
  const { repository, isGettingRepository } = useGetPageLocalRepository();

  if (isGettingRepository) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Edit {repository.displayName}</SidePanel.Header>
      <SidePanel.Content>
        <EditLocalRepositoryForm repository={repository} />
      </SidePanel.Content>
    </>
  );
};

export default EditLocalRepositorySidePanel;
