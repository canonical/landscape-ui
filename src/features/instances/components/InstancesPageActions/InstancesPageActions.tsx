import { FC, lazy, Suspense } from "react";
import { Button, ConfirmationButton, Icon } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import useInstances from "@/hooks/useInstances";
import { Instance } from "@/types/Instance";
import useNotify from "@/hooks/useNotify";
import { useActivities } from "@/features/activities";
import { getNotificationArgs } from "./helpers";

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
const AccessGroupChange = lazy(() => import("../AccessGroupChange"));

interface InstancesPageActionsProps {
  selected: Instance[];
}

const InstancesPageActions: FC<InstancesPageActionsProps> = ({ selected }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { openActivityDetails } = useActivities();
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
      const { data: shutdownActivity } = await shutdownInstances({
        computer_ids: selected.map(({ id }) => id),
      });

      notify.success(
        getNotificationArgs({
          action: "shutdown",
          onDetailsClick: () => openActivityDetails(shutdownActivity),
          selected,
        }),
      );
    } catch (error) {
      debug(error);
    }
  };

  const handleRebootInstance = async () => {
    try {
      const { data: rebootActivity } = await rebootInstances({
        computer_ids: selected.map(({ id }) => id),
      });

      notify.success(
        getNotificationArgs({
          action: "reboot",
          onDetailsClick: () => openActivityDetails(rebootActivity),
          selected,
        }),
      );
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

  const handleAccessGroupChange = () => {
    setSidePanelContent(
      "Assign access group",
      <Suspense fallback={<LoadingState />}>
        <AccessGroupChange selected={selected} />
      </Suspense>,
    );
  };

  return (
    <div className="p-segmented-control">
      <div className="p-segmented-control__list">
        <ConfirmationButton
          className="p-segmented-control__button has-icon"
          type="button"
          disabled={shutdownInstancesLoading || 0 === selected.length}
          confirmationModalProps={{
            title: "Shutting down selected instances",
            children: (
              <p>
                Are you sure you want to shutdown {selected.length} instance
                {selected.length === 1 ? "" : "s"}?
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
                Are you sure you want to restart {selected.length} instance
                {selected.length === 1 ? "" : "s"}?
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
        <Button
          className="p-segmented-control__button"
          type="button"
          onClick={handleAccessGroupChange}
          disabled={0 === selected.length}
        >
          <Icon name="settings" />
          <span>Assign access group</span>
        </Button>
      </div>
    </div>
  );
};

export default InstancesPageActions;
