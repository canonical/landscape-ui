import LoadingState from "@/components/layout/LoadingState";
import { ResponsiveButtons } from "@/components/ui";
import { REPORT_VIEW_ENABLED } from "@/constants";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import {
  Button,
  ConfirmationModal,
  ContextualMenu,
  Icon,
} from "@canonical/react-components";
import { lazy, memo, Suspense, useState } from "react";
import { getFeatures, hasUpgrades } from "../../helpers";
import { getNotificationArgs } from "./helpers";
import classes from "./InstancesPageActions.module.scss";

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
  readonly isGettingInstances: boolean;
  readonly selectedInstances: Instance[];
}

const InstancesPageActions = memo(function InstancesPageActions({
  isGettingInstances,
  selectedInstances,
}: InstancesPageActionsProps) {
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
        {selectedInstances.some(
          (instance) => !getFeatures(instance).scripts,
        ) ? (
          <div className={classes.warning}>
            <p>
              You selected {selectedInstances.length} instances. This script
              will:
            </p>

            <ul>
              <li>
                run on{" "}
                {createInstanceCountString(
                  selectedInstances.filter(
                    (instance) => getFeatures(instance).scripts,
                  ),
                )}
              </li>
              <li>
                not run on{" "}
                {createInstanceCountString(
                  selectedInstances.filter(
                    (instance) => !getFeatures(instance).scripts,
                  ),
                )}
              </li>
            </ul>
          </div>
        ) : null}
        <RunInstanceScriptForm
          query={selectedInstances.map(({ id }) => `id:${id}`).join(" OR ")}
        />
      </Suspense>,
    );
  };

  const handleShutdownInstance = async () => {
    try {
      const { data: shutdownActivity } = await shutdownInstances({
        computer_ids: selectedInstances.map(({ id }) => id),
      });

      notify.success(
        getNotificationArgs({
          action: "shutdown",
          onDetailsClick: () => {
            openActivityDetails(shutdownActivity);
          },
          selected: selectedInstances,
        }),
      );
    } catch (error) {
      debug(error);
    }
  };

  const handleRebootInstance = async () => {
    try {
      const { data: rebootActivity } = await rebootInstances({
        computer_ids: selectedInstances.map(({ id }) => id),
      });

      notify.success(
        getNotificationArgs({
          action: "reboot",
          onDetailsClick: () => {
            openActivityDetails(rebootActivity);
          },
          selected: selectedInstances,
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
        <Upgrades selectedInstances={selectedInstances} />
      </Suspense>,
      "large",
    );
  };

  const handleReportView = () => {
    setSidePanelContent(
      `Report for ${pluralize(selectedInstances.length, selectedInstances[0]?.title ?? "1 instance", `${selectedInstances.length} instances`)}`,
      <Suspense fallback={<LoadingState />}>
        <ReportView instanceIds={selectedInstances.map(({ id }) => id)} />
      </Suspense>,
      "medium",
    );
  };

  const handleAccessGroupChange = () => {
    setSidePanelContent(
      "Assign access group",
      <Suspense fallback={<LoadingState />}>
        <AccessGroupChange selected={selectedInstances} />
      </Suspense>,
    );
  };

  const handleTagsAssign = () => {
    setSidePanelContent(
      "Assign tags",
      <Suspense fallback={<LoadingState />}>
        <TagsAddForm selected={selectedInstances} />
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
            disabled={
              shutdownInstancesLoading ||
              0 === selectedInstances.length ||
              isGettingInstances
            }
            onClick={() => {
              setShutdownModalOpen(true);
            }}
          >
            <Icon name="power-off" />
            <span>Shut down</span>
          </Button>,
          <Button
            key="reboot-instances"
            hasIcon
            type="button"
            disabled={
              rebootInstancesLoading ||
              0 === selectedInstances.length ||
              isGettingInstances
            }
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
              disabled={0 === selectedInstances.length}
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
            disabled={
              selectedInstances.every((instance) => {
                return !getFeatures(instance).scripts;
              }) || isGettingInstances
            }
          >
            <Icon name="code" />
            <span>Run script</span>
          </Button>,
          <Button
            key="upgrade-instances"
            type="button"
            hasIcon
            onClick={handleUpgradesRequest}
            disabled={
              selectedInstances.every(
                (instance) => !hasUpgrades(instance.alerts),
              ) || isGettingInstances
            }
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
        toggleDisabled={0 === selectedInstances.length}
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
            Are you sure you want to restart {selectedInstances.length}
            {pluralize(selectedInstances.length, "instance")}?
          </p>
        </ConfirmationModal>
      )}
      {shutdownModalOpen && (
        <ConfirmationModal
          close={() => {
            setShutdownModalOpen(false);
          }}
          title="Shutting down selected instances"
          confirmButtonLabel="Shut down"
          confirmButtonAppearance="negative"
          confirmButtonLoading={shutdownInstancesLoading}
          confirmButtonDisabled={shutdownInstancesLoading}
          onConfirm={handleShutdownInstance}
        >
          <p>
            Are you sure you want to shut down {selectedInstances.length}
            {pluralize(selectedInstances.length, "instance")}?
          </p>
        </ConfirmationModal>
      )}
    </>
  );
});

export default InstancesPageActions;
