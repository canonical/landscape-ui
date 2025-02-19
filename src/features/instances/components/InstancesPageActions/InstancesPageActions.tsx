import LoadingState from "@/components/layout/LoadingState";
import { REPORT_VIEW_ENABLED } from "@/constants";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import {
  Button,
  ConfirmationButton,
  ContextualMenu,
  Icon,
} from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { currentInstanceCan, hasUpgrades } from "../../helpers";
import { getNotificationArgs } from "./helpers";
import classes from "./InstancesPageActions.module.scss";

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
const TagsAddForm = lazy(() => import("../TagsAddForm"));

interface InstancesPageActionsProps {
  readonly selected: Instance[];
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

  const createInstanceCountString = (instances: Instance[]) => {
    return (
      <>
        <b>{instances.length}</b> instance{instances.length === 1 ? "" : "s"}
      </>
    );
  };

  const handleRunScript = async () => {
    setSidePanelContent(
      "Run script",
      <Suspense fallback={<LoadingState />}>
        {selected.some(
          (instance) => !currentInstanceCan("runScripts", instance),
        ) ? (
          <div className={classes.warning}>
            <p>You selected {selected.length} instances. This script will:</p>

            <ul>
              <li>
                run on{" "}
                {createInstanceCountString(
                  selected.filter((instance) =>
                    currentInstanceCan("runScripts", instance),
                  ),
                )}
              </li>
              <li>
                not run on{" "}
                {createInstanceCountString(
                  selected.filter(
                    (instance) => !currentInstanceCan("runScripts", instance),
                  ),
                )}
              </li>
            </ul>
          </div>
        ) : null}
        <RunInstanceScriptForm
          query={selected.map(({ id }) => `id:${id}`).join(" OR ")}
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

  const handleTagsAssign = () => {
    setSidePanelContent(
      "Assign tags",
      <Suspense fallback={<LoadingState />}>
        <TagsAddForm selected={selected} />
      </Suspense>,
    );
  };

  return (
    <>
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
          {REPORT_VIEW_ENABLED && (
            <Button
              className="p-segmented-control__button"
              type="button"
              onClick={handleReportView}
              disabled={0 === selected.length}
            >
              <Icon name="status" />
              <span>View report</span>
            </Button>
          )}
          <Button
            className="p-segmented-control__button"
            type="button"
            onClick={handleRunScript}
            disabled={selected.every((instance) => {
              return !currentInstanceCan("runScripts", instance);
            })}
          >
            <Icon name="code" />
            <span>Run script</span>
          </Button>
          <Button
            className="p-segmented-control__button"
            type="button"
            onClick={handleUpgradesRequest}
            disabled={selected.every(
              (instance) => !hasUpgrades(instance.alerts),
            )}
          >
            <Icon name="change-version" />
            <span>Upgrade</span>
          </Button>
        </div>
      </div>

      <ContextualMenu
        hasToggleIcon
        links={[
          {
            children: "Access group",
            onClick: handleAccessGroupChange,
          },
          {
            children: "Tags",
            onClick: handleTagsAssign,
          },
        ]}
        position="right"
        toggleLabel={
          <>
            <Icon name="plus" />
            <span>Assign</span>
          </>
        }
        toggleDisabled={0 === selected.length}
        dropdownProps={{ style: { zIndex: 10 } }}
      />
    </>
  );
};

export default InstancesPageActions;
