import { type FC } from "react";
import AppTabs from "@/components/AppTabs";
import SidePanel from "@/components/layout/SidePanel";
import ViewRepositoryActionsBlock from "./components/ViewRepositoryActionsBlock";
import ViewLocalRepositoryDetailsTab from "./components/ViewLocalRepositoryDetailsTab";
import ViewRepositoryPackagesTab from "./components/ViewRepositoryPackagesTab";
import { useGetLocalRepository } from "../../api";
import { DEFAULT_POLLING_INTERVAL } from "@/constants";
import {
  OperationStatusNotification,
  useGetOperation,
} from "@/features/operations";
import usePageParams from "@/hooks/usePageParams";

const ViewLocalRepositorySidePanel: FC = () => {
  const { name } = usePageParams();
  const { repository, isGettingRepository } = useGetLocalRepository(name);

  const { operation, isGettingOperation } = useGetOperation(
    repository?.lastOperation ?? "",
    {
      refetchInterval: ({ state }) =>
        state.error || state.data?.data.done ? false : DEFAULT_POLLING_INTERVAL,
    },
  );

  if (isGettingRepository) {
    return <SidePanel.LoadingState />;
  }
  if (!repository) {
    throw new Error(`Local repository ${name} was not found`);
  }

  if (!!repository.lastOperation && isGettingOperation) {
    return <SidePanel.LoadingState />;
  }

  const isImporting = !!operation && !operation.done;

  return (
    <>
      <SidePanel.Header>{repository.displayName}</SidePanel.Header>
      <SidePanel.Content>
        <OperationStatusNotification operation={operation} type="import" />
        <ViewRepositoryActionsBlock
          repository={repository}
          isImporting={isImporting}
        />
        <AppTabs
          aria-label="Repository details"
          slot="panel"
          items={[
            {
              id: "details",
              label: "General details",
              panel: (
                <ViewLocalRepositoryDetailsTab
                  repository={repository}
                  operationMetadata={operation?.metadata}
                />
              ),
            },
            {
              id: "packages",
              label: "Packages",
              panel: (
                <ViewRepositoryPackagesTab
                  repositoryName={repository.name ?? ""}
                  isImporting={isImporting}
                />
              ),
            },
          ]}
        />
      </SidePanel.Content>
    </>
  );
};

export default ViewLocalRepositorySidePanel;
