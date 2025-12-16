import LoadingState from "@/components/layout/LoadingState";
import { ResponsiveButtons } from "@/components/ui";
import { REPORT_VIEW_ENABLED } from "@/constants";
import { useActivities } from "@/features/activities";
import {
  PackagesInstallForm,
  PackagesUninstallForm,
} from "@/features/packages";
import { DetachTokenModal } from "@/features/ubuntupro";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import { hasOneItem, pluralize } from "@/utils/_helpers";
import {
  Button,
  ConfirmationModal,
  ContextualMenu,
  Icon,
} from "@canonical/react-components";
import { lazy, memo, Suspense, useState } from "react";
import { createPortal } from "react-dom";
import { useRestartInstances, useShutDownInstances } from "../../api";
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
const AttachTokenForm = lazy(async () =>
  import("@/features/ubuntupro").then((module) => ({
    default: module.AttachTokenForm,
  })),
);
const ReplaceTokenForm = lazy(async () =>
  import("@/features/ubuntupro").then((module) => ({
    default: module.ReplaceTokenForm,
  })),
);

interface InstancesPageActionsProps {
  readonly isGettingInstances: boolean;
  readonly selectedInstances: Instance[];
}

const InstancesPageActions = memo(function InstancesPageActions({
  isGettingInstances,
  selectedInstances,
}: InstancesPageActionsProps) {
  const debug = useDebug();
  const { isFeatureEnabled } = useAuth();
  const { notify } = useNotify();
  const { openActivityDetails } = useActivities();
  const { setSidePanelContent } = useSidePanel();

  const [rebootModalOpen, setRebootModalOpen] = useState(false);
  const [shutdownModalOpen, setShutdownModalOpen] = useState(false);
  const [detachModalOpen, setDetachModalOpen] = useState(false);

  const { restartInstances, isRestartingInstances } = useRestartInstances();
  const { shutDownInstances, isShuttingDownInstances } = useShutDownInstances();

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
      const { data: shutdownActivity } = await shutDownInstances({
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
      const { data: rebootActivity } = await restartInstances({
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

  const openInstallPackagesForm = () => {
    setSidePanelContent(
      "Install packages",
      <Suspense fallback={<LoadingState />}>
        <PackagesInstallForm
          instanceIds={selectedInstances.map(({ id }) => id)}
        />
      </Suspense>,
    );
  };

  const openUninstallPackagesForm = () => {
    setSidePanelContent(
      "Uninstall packages",
      <Suspense fallback={<LoadingState />}>
        <PackagesUninstallForm
          instanceIds={selectedInstances.map(({ id }) => id)}
        />
      </Suspense>,
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

  const handleAttachToken = () => {
    setSidePanelContent(
      `Attach Ubuntu Pro token to ${selectedInstances.length} ${pluralize(selectedInstances.length, "instance")}`,
      <Suspense fallback={<LoadingState />}>
        <AttachTokenForm selectedInstances={selectedInstances} />
      </Suspense>,
    );
  };

  const handleReplaceToken = () => {
    setSidePanelContent(
      `Replace Ubuntu Pro token for ${selectedInstances.length} ${pluralize(selectedInstances.length, "instance")}`,
      <Suspense fallback={<LoadingState />}>
        <ReplaceTokenForm selectedInstances={selectedInstances} />
      </Suspense>,
    );
  };

  const allInstancesHaveToken = selectedInstances.every(
    (instance) =>
      instance.ubuntu_pro_info?.result === "success" &&
      instance.ubuntu_pro_info.attached,
  );

  const proServicesLinks = [
    allInstancesHaveToken
      ? {
          children: <span>Replace token</span>,
          onClick: handleReplaceToken,
        }
      : {
          children: <span>Attach token</span>,
          onClick: handleAttachToken,
        },
    isFeatureEnabled("ubuntu_pro_licensing")
      ? {
          children: <span>Detach token</span>,
          onClick: () => {
            setDetachModalOpen(true);
          },
        }
      : {},
  ].filter((link) => link.children);

  const managePackagesLinks = [
    {
      children: (
        <>
          <Icon name="arrow-up" />
          <span>Upgrade</span>
        </>
      ),
      onClick: handleUpgradesRequest,
      disabled: selectedInstances.every(
        (instance) => !hasUpgrades(instance.alerts),
      ),
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="begin-downloading" />
          <span>Install</span>
        </>
      ),
      onClick: openInstallPackagesForm,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="delete" />
          <span>Uninstall</span>
        </>
      ),
      onClick: openUninstallPackagesForm,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="arrow-down" />
          <span>Downgrade</span>
        </>
      ),
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="pause" />
          <span>Hold</span>
        </>
      ),
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="play" />
          <span>Unhold</span>
        </>
      ),
      hasIcon: true,
    },
  ];

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
              isShuttingDownInstances ||
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
              isRestartingInstances ||
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
          hasOneItem(proServicesLinks) ? (
            <Button
              key="pro-services"
              type="button"
              className="u-no-margin--bottom"
              onClick={proServicesLinks[0].onClick}
              disabled={0 === selectedInstances.length}
            >
              {proServicesLinks[0].children}
            </Button>
          ) : (
            <ContextualMenu
              position="left"
              key="pro-services"
              hasToggleIcon
              links={proServicesLinks}
              toggleLabel={<span>Pro services</span>}
              toggleClassName="u-no-margin--bottom"
              toggleDisabled={0 === selectedInstances.length}
              dropdownProps={{ style: { zIndex: 10 } }}
            />
          ),
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
          <ContextualMenu
            key="upgrade-instances"
            hasToggleIcon
            links={managePackagesLinks}
            position="right"
            toggleLabel={<span>Manage packages</span>}
            toggleClassName="u-no-margin--bottom"
            toggleDisabled={
              !selectedInstances.length ||
              selectedInstances.every(
                (instance) => !getFeatures(instance).packages,
              )
            }
            dropdownProps={{ style: { zIndex: 10 } }}
          />,
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
      {rebootModalOpen &&
        createPortal(
          <ConfirmationModal
            close={() => {
              setRebootModalOpen(false);
            }}
            title="Restarting selected instances"
            confirmButtonLabel="Restart"
            confirmButtonAppearance="negative"
            confirmButtonLoading={isRestartingInstances}
            confirmButtonDisabled={isRestartingInstances}
            onConfirm={handleRebootInstance}
          >
            <p>
              Are you sure you want to restart {selectedInstances.length}
              {pluralize(selectedInstances.length, "instance")}?
            </p>
          </ConfirmationModal>,
          document.body,
        )}
      {shutdownModalOpen &&
        createPortal(
          <ConfirmationModal
            close={() => {
              setShutdownModalOpen(false);
            }}
            title="Shutting down selected instances"
            confirmButtonLabel="Shut down"
            confirmButtonAppearance="negative"
            confirmButtonLoading={isShuttingDownInstances}
            confirmButtonDisabled={isShuttingDownInstances}
            onConfirm={handleShutdownInstance}
          >
            <p>
              Are you sure you want to shut down {selectedInstances.length}{" "}
              {pluralize(selectedInstances.length, "instance")}?
            </p>
          </ConfirmationModal>,
          document.body,
        )}
      {detachModalOpen && (
        <DetachTokenModal
          isOpen={detachModalOpen}
          onClose={() => {
            setDetachModalOpen(false);
          }}
          computerIds={selectedInstances.map(({ id }) => id)}
        />
      )}
    </>
  );
});

export default InstancesPageActions;
