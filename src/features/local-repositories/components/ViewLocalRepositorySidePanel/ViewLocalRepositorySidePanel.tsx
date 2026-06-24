import { Suspense, useState, type FC } from "react";
import SidePanel from "@/components/layout/SidePanel";
import LoadingState from "@/components/layout/LoadingState";
import { Tabs, Notification } from "@canonical/react-components";
import classes from "./ViewLocalRepositorySidePanel.module.scss";
import ViewRepositoryActionsBlock from "./components/ViewRepositoryActionsBlock";
import ViewLocalRepositoryDetailsTab from "./components/ViewLocalRepositoryDetailsTab";
import ViewRepositoryPackagesTab from "./components/ViewRepositoryPackagesTab";
import { useGetLocalRepository } from "../../api";
import { DEFAULT_POLLING_INTERVAL } from "@/constants";
import { useGetOperation, ViewLogsButton } from "@/features/operations";
import usePageParams from "@/hooks/usePageParams";

const ViewLocalRepositorySidePanel: FC = () => {
  const { name } = usePageParams();
  const [tabId, setTabId] = useState<"details" | "packages">("details");
  const repository = useGetLocalRepository(name);

  const { operation, isGettingOperation } = useGetOperation(
    repository.lastOperation ?? "",
    {
      enabled: !!repository.lastOperation,
      refetchInterval: ({ state }) =>
        state.error || state.data?.data.done ? false : DEFAULT_POLLING_INTERVAL,
    },
  );

  if (!!repository.lastOperation && isGettingOperation) {
    return <SidePanel.LoadingState />;
  }

  const tabs: { label: string; id: "details" | "packages" }[] = [
    { label: "General details", id: "details" },
    { label: "Packages", id: "packages" },
  ];

  const links = tabs.map(({ label, id }) => ({
    label,
    active: tabId == id,
    onClick: () => {
      setTabId(id);
    },
  }));

  const isImporting = !!operation && !operation.done;

  return (
    <>
      <SidePanel.Header>{repository.displayName}</SidePanel.Header>
      <SidePanel.Content>
        {!!operation?.error && (
          <Notification
            severity="negative"
            title="Package import failed"
            actions={[
              <ViewLogsButton key="view-logs" />,
            ]}
          >
            Your last package import was not completed successfully.
          </Notification>
        )}
        <ViewRepositoryActionsBlock
          repository={repository}
          isImporting={isImporting}
        />
        <Tabs listClassName={classes.marginBottom} links={links} />

        {tabId === "details" && (
          <Suspense fallback={<LoadingState />}>
            <ViewLocalRepositoryDetailsTab
              repository={repository}
              operationMetadata={operation?.metadata}
              key="details"
            />
          </Suspense>
        )}

        {tabId === "packages" && (
          <Suspense fallback={<LoadingState />}>
            <ViewRepositoryPackagesTab
              repositoryName={repository.name ?? ""}
              isImporting={isImporting}
              key="packages"
            />
          </Suspense>
        )}
      </SidePanel.Content>
    </>
  );
};

export default ViewLocalRepositorySidePanel;
