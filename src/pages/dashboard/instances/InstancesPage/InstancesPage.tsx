import { FC, lazy, Suspense, useState } from "react";
import PageMain from "@/components/layout/PageMain";
import PageHeader from "@/components/layout/PageHeader";
import PageContent from "@/components/layout/PageContent";
import InstancesContainer from "@/pages/dashboard/instances/InstancesContainer/InstancesContainer";
import { Button, ConfirmationButton, Icon } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import classes from "./InstancesPage.module.scss";
import useSidePanel from "@/hooks/useSidePanel";
import { Instance } from "@/types/Instance";
import LoadingState from "@/components/layout/LoadingState";

const RunInstanceScriptForm = lazy(() =>
  import("@/features/scripts").then((module) => ({
    default: module.RunInstanceScriptForm,
  })),
);
const Upgrades = lazy(() =>
  import("@/features/upgrades").then((module) => ({
    default: module.Upgrades,
  })),
);
const ReportView = lazy(() => import("@/pages/dashboard/instances/ReportView"));

const InstancesPage: FC = () => {
  const [selected, setSelected] = useState<Instance[]>([]);

  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();

  const { rebootInstancesQuery, shutdownInstancesQuery } = useInstances();

  const { mutateAsync: rebootInstances, isPending: rebootInstancesLoading } =
    rebootInstancesQuery;
  const {
    mutateAsync: shutdownInstances,
    isPending: shutdownInstancesLoading,
  } = shutdownInstancesQuery;

  const handleRunScript = async () => {
    setSidePanelContent(
      "Run script",
      <Suspense fallback={<LoadingState />}>
        <RunInstanceScriptForm
          query={`id:${selected.map(({ id }) => id).join(" id:")}`}
        />
      </Suspense>,
    );
  };

  const handleShutdownInstance = async () => {
    try {
      await shutdownInstances({
        computer_ids: selected.map(({ id }) => id),
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleRebootInstance = async () => {
    try {
      await rebootInstances({
        computer_ids: selected.map(({ id }) => id),
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleUpgradesRequest = () => {
    setSidePanelContent(
      "Upgrades",
      <Suspense fallback={<LoadingState />}>
        <Upgrades selectedInstances={selected} />
      </Suspense>,
      "large",
    );
  };

  const handleReportView = () => {
    setSidePanelContent(
      `Report for ${selected.length === 1 ? selected[0].title : `${selected.length} instances`}`,
      <Suspense fallback={<LoadingState />}>
        <ReportView instanceIds={selected.map(({ id }) => id)} />
      </Suspense>,
      "medium",
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="Instances"
        className={classes.header}
        actions={[
          <div key="buttons" className="p-segmented-control">
            <div className="p-segmented-control__list">
              <ConfirmationButton
                className="p-segmented-control__button has-icon"
                type="button"
                disabled={shutdownInstancesLoading || 0 === selected.length}
                confirmationModalProps={{
                  title: "Shutting down selected instances",
                  children: (
                    <p>
                      Are you sure you want to shutdown {selected.length}{" "}
                      instance{selected.length === 1 ? "" : "s"}?
                    </p>
                  ),
                  confirmButtonLabel: "Shutdown",
                  confirmButtonAppearance: "negative",
                  confirmButtonLoading: shutdownInstancesLoading,
                  confirmButtonDisabled: shutdownInstancesLoading,
                  onConfirm: handleShutdownInstance,
                }}
              >
                <Icon name="power-off" />
                <span>Shutdown</span>
              </ConfirmationButton>
              <ConfirmationButton
                className="p-segmented-control__button has-icon"
                type="button"
                disabled={rebootInstancesLoading || 0 === selected.length}
                confirmationModalProps={{
                  title: "Restarting selected instances",
                  children: (
                    <p>
                      Are you sure you want to restart {selected.length}{" "}
                      instance{selected.length === 1 ? "" : "s"}?
                    </p>
                  ),
                  confirmButtonLabel: "Restart",
                  confirmButtonAppearance: "negative",
                  confirmButtonLoading: rebootInstancesLoading,
                  confirmButtonDisabled: rebootInstancesLoading,
                  onConfirm: handleRebootInstance,
                }}
              >
                <Icon name="restart" />
                <span>Restart</span>
              </ConfirmationButton>
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={handleReportView}
                disabled={0 === selected.length}
              >
                <Icon name="status" />
                <span>View report</span>
              </Button>
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={handleRunScript}
                disabled={0 === selected.length}
              >
                <Icon name="code" />
                <span>Run script</span>
              </Button>
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={handleUpgradesRequest}
                disabled={
                  0 === selected.length ||
                  selected.every(
                    ({ upgrades }) =>
                      !upgrades || (!upgrades.regular && !upgrades.security),
                  )
                }
              >
                <Icon name="change-version" />
                <span>Upgrade</span>
              </Button>
            </div>
          </div>,
        ]}
      />
      <PageContent>
        <InstancesContainer
          selectedInstances={selected}
          setSelectedInstances={(instances) => {
            setSelected(instances);
          }}
        />
      </PageContent>
    </PageMain>
  );
};

export default InstancesPage;
