import { FC, lazy, Suspense, useState } from "react";
import PageMain from "@/components/layout/PageMain";
import PageHeader from "@/components/layout/PageHeader";
import PageContent from "@/components/layout/PageContent";
import InstancesContainer from "@/pages/dashboard/instances/InstancesContainer/InstancesContainer";
import { Button, Icon } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useConfirm from "@/hooks/useConfirm";
import classes from "./InstancesPage.module.scss";
import useSidePanel from "@/hooks/useSidePanel";
import { Instance } from "@/types/Instance";
import LoadingState from "@/components/layout/LoadingState";

const RunScriptForm = lazy(
  () => import("@/pages/dashboard/instances/RunScriptForm/RunScriptForm"),
);
const Upgrades = lazy(() => import("@/pages/dashboard/instances/Upgrades"));
const ReportView = lazy(() => import("@/pages/dashboard/instances/ReportView"));

const InstancesPage: FC = () => {
  const [selected, setSelected] = useState<Instance[]>([]);

  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { confirmModal, closeConfirmModal } = useConfirm();

  const { rebootInstancesQuery, shutdownInstancesQuery } = useInstances();

  const { mutateAsync: rebootInstances, isLoading: rebootInstancesLoading } =
    rebootInstancesQuery;
  const {
    mutateAsync: shutdownInstances,
    isLoading: shutdownInstancesLoading,
  } = shutdownInstancesQuery;

  const handleRunScript = async () => {
    setSidePanelContent(
      "Run script",
      <Suspense fallback={<LoadingState />}>
        <RunScriptForm
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
    } finally {
      closeConfirmModal();
    }
  };

  const handleShutdownInstanceDialog = () => {
    confirmModal({
      title: "Shutting down selected instances",
      body: `Are you sure you want to shutdown ${selected.length} instance${
        selected.length > 1 ? "s" : ""
      }?`,
      buttons: [
        <Button
          key="shutdown"
          appearance="negative"
          onClick={handleShutdownInstance}
        >
          Shutdown
        </Button>,
      ],
    });
  };

  const handleRebootInstance = async () => {
    try {
      await rebootInstances({
        computer_ids: selected.map(({ id }) => id),
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRebootInstanceDialog = () => {
    confirmModal({
      title: "Restarting selected instances",
      body: `Are you sure you want to restart ${selected.length} instance${
        selected.length > 1 ? "s" : ""
      }?`,
      buttons: [
        <Button
          key="restart"
          appearance="negative"
          onClick={handleRebootInstance}
        >
          Restart
        </Button>,
      ],
    });
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
      `Report for ${selected.length > 1 ? `${selected.length} instances` : selected[0].title}`,
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
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={handleShutdownInstanceDialog}
                disabled={shutdownInstancesLoading || 0 === selected.length}
              >
                <Icon name="power-off" />
                <span>Shutdown</span>
              </Button>
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={handleRebootInstanceDialog}
                disabled={rebootInstancesLoading || 0 === selected.length}
              >
                <Icon name="restart" />
                <span>Restart</span>
              </Button>
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
