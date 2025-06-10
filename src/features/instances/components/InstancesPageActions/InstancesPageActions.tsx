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
  ConfirmationModal,
  ContextualMenu,
  Icon,
} from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { currentInstanceCan, hasUpgrades } from "../../helpers";
import { getNotificationArgs } from "./helpers";
import classes from "./InstancesPageActions.module.scss";
import { pluralize } from "@/utils/_helpers";
import { ResponsiveButtons } from "@/components/ui";

const RunInstanceScriptForm = lazy(async () =>
  import("@/features/scripts").then((module) => ({
    default: module.RunInstanceScriptForm,
  })),
);
const Upgrades = lazy(async () =>
  import("@/features/upgrades").then((module) => ({
    default: module.Upgrades,
  })),
);
const ReportView = lazy(
  async () => import("@/pages/dashboard/instances/ReportView"),
);
const AccessGroupChange = lazy(async () => import("../AccessGroupChange"));
const TagsAddForm = lazy(async () => import("../TagsAddForm"));

interface InstancesPageActionsProps {
  readonly selected: Instance[];
}

const InstancesPageActions: FC<InstancesPageActionsProps> = ({ selected }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { openActivityDetails } = useActivities();
  const { setSidePanelContent } = useSidePanel();

  const [rebootModalOpen, setRebootModalOpen] = useState(false);
  const [shutdownModalOpen, setShutdownModalOpen] = useState(false);

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
        <b>{instances.length}</b> {pluralize(instances.length, "instance")}
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
          onDetailsClick: () => {
            openActivityDetails(shutdownActivity);
          },
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
          onDetailsClick: () => {
            openActivityDetails(rebootActivity);
          },
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
      `Report for ${pluralize(selected.length, selected[0].title, `${selected.length} instances`)}`,
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
      <ResponsiveButtons
        collapseFrom="xl"
        buttons={[
          <Button
            key="shutdown-instances"
            className="has-icon"
            type="button"
            disabled={shutdownInstancesLoading || 0 === selected.length}
            onClick={() => {
              setShutdownModalOpen(true);
            }}
          >
            <Icon name="power-off" />
            <span>Shutdown</span>
          </Button>,
          <Button
            key="reboot-instances"
            hasIcon
            type="button"
            disabled={rebootInstancesLoading || 0 === selected.length}
            onClick={() => {
              setRebootModalOpen(true);
            }}
          >
            <Icon name="restart" />
            <span>Restart</span>
          </Button>,
          REPORT_VIEW_ENABLED && (
            <Button
              key="report-view"
              type="button"
              onClick={handleReportView}
              disabled={0 === selected.length}
            >
              <Icon name="status" />
              <span>View report</span>
            </Button>
          ),
          <Button
            key="run-script"
            type="button"
            hasIcon
            onClick={handleRunScript}
            disabled={selected.every((instance) => {
              return !currentInstanceCan("runScripts", instance);
            })}
          >
            <Icon name="code" />
            <span>Run script</span>
          </Button>,
          <Button
            key="upgrade-instances"
            type="button"
            hasIcon
            onClick={handleUpgradesRequest}
            disabled={selected.every(
              (instance) => !hasUpgrades(instance.alerts),
            )}
          >
            <Icon name="change-version" />
            <span>Upgrade</span>
          </Button>,
        ]}
      />
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
        toggleClassName="u-no-margin--bottom"
        toggleDisabled={0 === selected.length}
        dropdownProps={{ style: { zIndex: 10 } }}
      />
      {rebootModalOpen && (
        <ConfirmationModal
          close={() => {
            setRebootModalOpen(false);
          }}
          title="Restarting selected instances"
          confirmButtonLabel="Restart"
          confirmButtonAppearance="negative"
          confirmButtonLoading={rebootInstancesLoading}
          confirmButtonDisabled={rebootInstancesLoading}
          onConfirm={handleRebootInstance}
        >
          <p>
            Are you sure you want to restart {selected.length}
            {pluralize(selected.length, "instance")}?
          </p>
        </ConfirmationModal>
      )}
      {shutdownModalOpen && (
        <ConfirmationModal
          close={() => {
            setShutdownModalOpen(false);
          }}
          title="Shutting down selected instances"
          confirmButtonLabel="Shutdown"
          confirmButtonAppearance="negative"
          confirmButtonLoading={shutdownInstancesLoading}
          confirmButtonDisabled={shutdownInstancesLoading}
          onConfirm={handleShutdownInstance}
        >
          <p>
            Are you sure you want to shutdown {selected.length}
            {pluralize(selected.length, "instance")}?
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default InstancesPageActions;
