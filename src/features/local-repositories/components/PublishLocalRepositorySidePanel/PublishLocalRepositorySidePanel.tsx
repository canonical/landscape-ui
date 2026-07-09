import { RadioInput } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./PublishLocalRepositorySidePanel.module.scss";
import { useGetPublicationsBySource } from "@/features/publications";
import SidePanel from "@/components/layout/SidePanel";
import PublishRepositoryNewForm from "./components/PublishRepositoryNewForm";
import PublishRepositoryExistingForm from "./components/PublishRepositoryExistingForm";
import { useBoolean } from "usehooks-ts";
import usePageParams from "@/hooks/usePageParams/usePageParams";
import { useGetLocalRepository } from "../../api";

const PublishLocalRepositorySidePanel: FC = () => {
  const { name } = usePageParams();
  const repository = useGetLocalRepository(name);
  const { publications, isGettingPublications } = useGetPublicationsBySource(
    repository.name,
  );

  const { value: useNewPublication, toggle } = useBoolean(true);

  if (isGettingPublications) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Publish {repository.displayName}</SidePanel.Header>
      <SidePanel.Content>
        {!!publications.length && (
          <>
            <div className={classes.publish}>Publish to</div>
            <div className={classes.radio}>
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
            </div>
          </>
        )}

        {useNewPublication ? (
          <PublishRepositoryNewForm repository={repository} />
        ) : (
          <PublishRepositoryExistingForm
            repository={repository}
            publications={publications}
          />
        )}
      </SidePanel.Content>
    </>
  );
};

export default PublishLocalRepositorySidePanel;
