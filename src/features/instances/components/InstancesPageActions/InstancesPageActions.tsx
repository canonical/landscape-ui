import LoadingState from "@/components/layout/LoadingState";
import { ResponsiveButtons } from "@/components/ui";
import { REPORT_VIEW_ENABLED } from "@/constants";
import { useActivities } from "@/features/activities";
import type { PackageAction } from "@/features/packages";
import { PackagesActionForm } from "@/features/packages";
import { DetachTokenModal } from "@/features/ubuntupro";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import {
  capitalize,
  hasOneItem,
  pluralize,
  pluralizeArray,
  pluralizeWithCount,
} from "@/utils/_helpers";
import {
  Button,
  ConfirmationModal,
  ContextualMenu,
  Icon,
} from "@canonical/react-components";
import { lazy, Suspense, useState } from "react";
import { createPortal } from "react-dom";
import { useRestartInstances, useShutDownInstances } from "../../api";
import { getFeatures, hasSecurityUpgrades, hasUpgrades } from "../../helpers";
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
const UpgradesSummary = lazy(async () =>
  import("@/features/upgrades").then((module) => ({
    default: module.UpgradesSummary,
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
  readonly toggledInstances: Instance[];
  readonly areAllInstancesSelected: boolean;
  readonly instanceCount: number;
  readonly query?: string;
}

const InstancesPageActions = ({
  isGettingInstances,
  toggledInstances,
  areAllInstancesSelected,
  instanceCount,
  query,
}: InstancesPageActionsProps) => {
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
        {toggledInstances.some((instance) => !getFeatures(instance).scripts) ? (
          <div className={classes.warning}>
            <p>
              You selected{" "}
              {pluralizeWithCount(toggledInstances.length, "instance")}. This
              script will:
            </p>

            <ul>
              <li>
                run on{" "}
                {createInstanceCountString(
                  toggledInstances.filter(
                    (instance) => getFeatures(instance).scripts,
                  ),
                )}
              </li>
              <li>
                not run on{" "}
                {createInstanceCountString(
                  toggledInstances.filter(
                    (instance) => !getFeatures(instance).scripts,
                  ),
                )}
              </li>
            </ul>
          </div>
        ) : null}
        <RunInstanceScriptForm
          query={toggledInstances.map(({ id }) => `id:${id}`).join(" OR ")}
        />
      </Suspense>,
    );
  };

  const handleShutdownInstance = async () => {
    try {
      const { data: shutdownActivity } = await shutDownInstances({
        computer_ids: toggledInstances.map(({ id }) => id),
      });

      notify.success(
        getNotificationArgs({
          action: "shutdown",
          onDetailsClick: () => {
            openActivityDetails(shutdownActivity);
          },
          selected: toggledInstances,
        }),
      );
    } catch (error) {
      debug(error);
    }
  };

  const handleRebootInstance = async () => {
    try {
      const { data: rebootActivity } = await restartInstances({
        computer_ids: toggledInstances.map(({ id }) => id),
      });

      notify.success(
        getNotificationArgs({
          action: "reboot",
          onDetailsClick: () => {
            openActivityDetails(rebootActivity);
          },
          selected: toggledInstances,
        }),
      );
    } catch (error) {
      debug(error);
    }
  };

  const handleUpgradesRequest = () => {
    setSidePanelContent(
      `Upgrade ${pluralizeArray(toggledInstances, (toggledInstance) => toggledInstance.title, "instances")}`,
      <Suspense fallback={<LoadingState />}>
        <Upgrades query={query} toggledInstances={toggledInstances} />
      </Suspense>,
      "large",
    );
  };

  const handleAllUpgradesRequest = () => {
    setSidePanelContent(
      "Apply all upgrades",
      <Suspense fallback={<LoadingState />}>
        <UpgradesSummary query={query} isSelectAllUpgradesEnabled />
      </Suspense>,
      "medium",
    );
  };

  const handleAllSecurityUpgradesRequest = () => {
    setSidePanelContent(
      "Apply all security upgrades",
      <Suspense fallback={<LoadingState />}>
        <UpgradesSummary
          query={query}
          isSelectAllUpgradesEnabled
          upgradeType="security"
        />
      </Suspense>,
      "medium",
    );
  };

  const openPackagesActionForm = (action: PackageAction) => {
    setSidePanelContent(
      `${capitalize(action)} packages`,
      <Suspense fallback={<LoadingState />}>
        <PackagesActionForm
          instanceIds={toggledInstances.map(({ id }) => id)}
          action={action}
        />
      </Suspense>,
    );
  };

  const handleReportView = () => {
    setSidePanelContent(
      `Report for ${pluralizeArray(toggledInstances, (selectedInstance) => selectedInstance.title, "instances")}`,
      <Suspense fallback={<LoadingState />}>
        <ReportView instanceIds={toggledInstances.map(({ id }) => id)} />
      </Suspense>,
      "medium",
    );
  };

  const handleAccessGroupChange = () => {
    setSidePanelContent(
      "Assign access group",
      <Suspense fallback={<LoadingState />}>
        <AccessGroupChange selected={toggledInstances} />
      </Suspense>,
    );
  };

  const handleTagsAssign = () => {
    setSidePanelContent(
      "Assign tags",
      <Suspense fallback={<LoadingState />}>
        <TagsAddForm selected={toggledInstances} />
      </Suspense>,
    );
  };

  const handleAttachToken = () => {
    setSidePanelContent(
      `Attach Ubuntu Pro token to ${pluralizeWithCount(toggledInstances.length, "instance")}`,
      <Suspense fallback={<LoadingState />}>
        <AttachTokenForm selectedInstances={toggledInstances} />
      </Suspense>,
    );
  };

  const handleReplaceToken = () => {
    setSidePanelContent(
      `Replace Ubuntu Pro token for ${pluralizeWithCount(toggledInstances.length, "instance")}`,
      <Suspense fallback={<LoadingState />}>
        <ReplaceTokenForm selectedInstances={toggledInstances} />
      </Suspense>,
    );
  };

  const allInstancesHaveToken = toggledInstances.every(
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

  const noInstanceHasUpgrades =
    !areAllInstancesSelected &&
    toggledInstances.every((instance) => !hasUpgrades(instance.alerts));

  const noInstanceHasPackageFeature =
    !areAllInstancesSelected &&
    toggledInstances.every((instance) => !getFeatures(instance).packages);

  const managePackagesLinks = [
    {
      children: (
        <>
          <Icon name="arrow-up" />
          <span>Apply upgrades (advanced)</span>
        </>
      ),
      onClick: handleUpgradesRequest,
      disabled: noInstanceHasUpgrades,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="arrow-up" />
          <span>Apply all upgrades</span>
        </>
      ),
      onClick: handleAllUpgradesRequest,
      disabled: noInstanceHasUpgrades,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="security" />
          <span>Apply all security upgrades</span>
        </>
      ),
      onClick: handleAllSecurityUpgradesRequest,
      disabled:
        !areAllInstancesSelected &&
        toggledInstances.every(
          (instance) => !hasSecurityUpgrades(instance.alerts),
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
      disabled: !areAllInstancesSelected && noInstanceHasPackageFeature,
      onClick: () => {
        openPackagesActionForm("install");
      },
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="delete" />
          <span>Uninstall</span>
        </>
      ),
      onClick: () => {
        openPackagesActionForm("uninstall");
      },
      disabled: !areAllInstancesSelected && noInstanceHasPackageFeature,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="arrow-down" />
          <span>Downgrade</span>
        </>
      ),
      disabled: !areAllInstancesSelected && noInstanceHasPackageFeature,
      onClick: () => {
        openPackagesActionForm("downgrade");
      },
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="pause" />
          <span>Hold</span>
        </>
      ),
      onClick: () => {
        openPackagesActionForm("hold");
      },
      disabled: !areAllInstancesSelected && noInstanceHasPackageFeature,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="play" />
          <span>Unhold</span>
        </>
      ),
      onClick: () => {
        openPackagesActionForm("unhold");
      },
      disabled: !areAllInstancesSelected && noInstanceHasPackageFeature,
      hasIcon: true,
    },
  ];

  const disabled =
    (!areAllInstancesSelected && toggledInstances.length <= 0) ||
    (areAllInstancesSelected && toggledInstances.length >= instanceCount) ||
    isGettingInstances;

  const nonBulkActionDisabled = disabled || areAllInstancesSelected;

  return (
    <>
      <ResponsiveButtons
        collapseFrom={REPORT_VIEW_ENABLED ? "xxl" : "xl"}
        disabled={disabled}
        buttons={[
          <Button
            key="shutdown-instances"
            className="has-icon"
            type="button"
            disabled={nonBulkActionDisabled || isShuttingDownInstances}
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
            disabled={nonBulkActionDisabled || isRestartingInstances}
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
              disabled={nonBulkActionDisabled}
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
              toggleDisabled={nonBulkActionDisabled}
            />
          ),
          REPORT_VIEW_ENABLED && (
            <Button
              key="report-view"
              type="button"
              onClick={handleReportView}
              disabled={nonBulkActionDisabled}
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
              toggledInstances.every((instance) => {
                return !getFeatures(instance).scripts;
              }) || areAllInstancesSelected
            }
          >
            <Icon name="code" />
            <span>Run script</span>
          </Button>,
          <ContextualMenu
            key="manage-packages"
            hasToggleIcon
            links={managePackagesLinks}
            position="right"
            toggleLabel={<span>Manage packages</span>}
            toggleClassName="u-no-margin--bottom"
            toggleDisabled={disabled}
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
        toggleDisabled={nonBulkActionDisabled}
        toggleClassName="u-no-margin--bottom"
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
              Are you sure you want to restart{" "}
              {pluralizeWithCount(toggledInstances.length, "instance")}?
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
              Are you sure you want to shut down{" "}
              {pluralizeWithCount(toggledInstances.length, "instance")}?
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
          computerIds={toggledInstances.map(({ id }) => id)}
        />
      )}
    </>
  );
};

export default InstancesPageActions;
