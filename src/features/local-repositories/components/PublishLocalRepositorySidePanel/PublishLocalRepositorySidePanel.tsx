import { type FC } from "react";
import SidePanel from "@/components/layout/SidePanel";
import { useGetPageLocalRepository } from "../../api/useGetPageLocalRepository";
import PublishRepositoryNewForm from "./components/PublishRepositoryNewForm";
import PublishRepositoryExistingForm from "./components/PublishRepositoryExistingForm";
import { RadioInput } from "@canonical/react-components";
import { useBoolean } from "usehooks-ts";

const PublishLocalRepositorySidePanel: FC = () => {
  const { repository, isGettingRepository } = useGetPageLocalRepository();
  const { value: useNewPublication, toggle } = useBoolean(true);

  if (isGettingRepository) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Publish {repository.display_name}</SidePanel.Header>
      <SidePanel.Content>
        <RadioInput
          label="New publication"
          checked={useNewPublication}
          onChange={toggle}
        />
        <RadioInput
          label="Existing publication"
          checked={!useNewPublication}
          onChange={toggle}
        />

        {useNewPublication 
          ? <PublishRepositoryNewForm repository={repository} />
          : <PublishRepositoryExistingForm repository={repository} />
        }
      </SidePanel.Content>
    </>
  );
};

export default PublishLocalRepositorySidePanel;
