import LoadingState from "@/components/layout/LoadingState";
import { ResponsiveButtons } from "@/components/ui";
import PluralizeWithBoldCount from "@/components/ui/PluralizeWithBoldCount";
import { REPORT_VIEW_ENABLED } from "@/constants";
import { useActivities } from "@/features/activities";
import { DetachTokenModal } from "@/features/ubuntupro";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import {
  hasOneItem,
  pluralizeArray,
  pluralizeWithCount,
} from "@/utils/_helpers";
import {
  Button,
  ConfirmationModal,
  ContextualMenu,
  Icon,
} from "@canonical/react-components";
import { lazy, memo, Suspense } from "react";
import { createPortal } from "react-dom";
import { useBoolean } from "usehooks-ts";
import { useRestartInstances, useShutDownInstances } from "../../api";
import { getFeatures, hasUpgrades } from "../../helpers";
import InstanceRemoveFromLandscapeModal from "../InstanceRemoveFromLandscapeModal";
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
const DistributionUpgrades = lazy(
  async () => import("../DistributionUpgrades"),
);
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

  const {
    value: rebootModalOpen,
    setTrue: openRebootModal,
    setFalse: closeRebootModal,
  } = useBoolean();

  const {
    value: shutdownModalOpen,
    setTrue: openShutdownModal,
    setFalse: closeShutdownModal,
  } = useBoolean();

  const {
    value: detachModalOpen,
    setTrue: openDetachModal,
    setFalse: closeDetachModal,
  } = useBoolean();

  const {
    value: removeModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  const { restartInstances, isRestartingInstances } = useRestartInstances();
  const { shutDownInstances, isShuttingDownInstances } = useShutDownInstances();

  const createInstanceCountString = (instances: Instance[]) => {
    return (
      <PluralizeWithBoldCount count={instances.length} singular="instance" />
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

  const handleDistributionUpgradesRequest = () => {
    setSidePanelContent(
      "Upgrade distributions",
      <Suspense fallback={<LoadingState />}>
        <DistributionUpgrades
          selectedInstances={selectedInstances.map(({ id }) => id)}
        />
      </Suspense>,
      "medium",
    );
  };

  const handleReportView = () => {
    setSidePanelContent(
      `Report for ${pluralizeArray(selectedInstances, (instance) => instance.title, `instances`)}`,
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
      `Attach Ubuntu Pro token to ${pluralizeWithCount(selectedInstances.length, "instance")}`,
      <Suspense fallback={<LoadingState />}>
        <AttachTokenForm selectedInstances={selectedInstances} />
      </Suspense>,
    );
  };

  const handleReplaceToken = () => {
    setSidePanelContent(
      `Replace Ubuntu Pro token for ${pluralizeWithCount(selectedInstances.length, "instance")}`,
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
          onClick: openDetachModal,
        }
      : {},
  ].filter((link) => link.children);

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
            onClick={openShutdownModal}
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
            onClick={openRebootModal}
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
          <Button
            key="remove"
            type="button"
            hasIcon
            onClick={openRemoveModal}
            disabled={!selectedInstances.length || isGettingInstances}
          >
            <Icon name="delete" />
            <span>Remove from Landscape</span>
          </Button>,
          <Button
            key="upgrade-distributions"
            type="button"
            hasIcon
            onClick={handleDistributionUpgradesRequest}
            disabled={
              0 === selectedInstances.length ||
              isGettingInstances ||
              !selectedInstances.some(
                (instance) => instance.has_release_upgrades,
              )
            }
          >
            <Icon name="arrow-up" />
            <span>Upgrade distributions</span>
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
      {rebootModalOpen &&
        createPortal(
          <ConfirmationModal
            close={closeRebootModal}
            title="Restarting selected instances"
            confirmButtonLabel="Restart"
            confirmButtonAppearance="negative"
            confirmButtonLoading={isRestartingInstances}
            confirmButtonDisabled={isRestartingInstances}
            onConfirm={handleRebootInstance}
          >
            <p>
              Are you sure you want to restart{" "}
              {pluralizeWithCount(selectedInstances.length, "instance")}?
            </p>
          </ConfirmationModal>,
          document.body,
        )}
      {shutdownModalOpen &&
        createPortal(
          <ConfirmationModal
            close={closeShutdownModal}
            title="Shutting down selected instances"
            confirmButtonLabel="Shut down"
            confirmButtonAppearance="negative"
            confirmButtonLoading={isShuttingDownInstances}
            confirmButtonDisabled={isShuttingDownInstances}
            onConfirm={handleShutdownInstance}
          >
            <p>
              Are you sure you want to shut down{" "}
              {pluralizeWithCount(selectedInstances.length, "instance")}?
            </p>
          </ConfirmationModal>,
          document.body,
        )}
      {detachModalOpen && (
        <DetachTokenModal
          isOpen={detachModalOpen}
          onClose={closeDetachModal}
          computerIds={selectedInstances.map(({ id }) => id)}
        />
      )}
      <InstanceRemoveFromLandscapeModal
        close={closeRemoveModal}
        instances={selectedInstances}
        isOpen={removeModalOpen}
      />
    </>
  );
});

export default InstancesPageActions;
