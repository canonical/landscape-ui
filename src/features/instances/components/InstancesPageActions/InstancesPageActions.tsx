import LoadingState from "@/components/layout/LoadingState";
import { ResponsiveButtons } from "@/components/ui";
import PluralizeWithBoldCount from "@/components/ui/PluralizeWithBoldCount";
import { REPORT_VIEW_ENABLED } from "@/constants";
import type { PackageAction } from "@/features/packages";
import { PackagesActionForm } from "@/features/packages";
import { DetachTokenModal } from "@/features/ubuntupro";
import useAuth from "@/hooks/useAuth";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import {
  capitalize,
  hasOneItem,
  pluralizeArray,
  pluralizeWithCount,
} from "@/utils/_helpers";
import { Button, ContextualMenu, Icon } from "@canonical/react-components";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import { getFeatures, hasSecurityUpgrades, hasUpgrades } from "../../helpers";
import InstanceRemoveFromLandscapeModal from "../InstanceRemoveFromLandscapeModal";
import classes from "./InstancesPageActions.module.scss";
import ShutDownModal from "../ShutDownModal";
import RestartModal from "../RestartModal";

const RunInstanceScriptForm = lazy(
  async () => import("@/features/scripts/components/RunInstanceScriptForm"),
);
const Upgrades = lazy(
  async () => import("@/features/upgrades/components/Upgrades"),
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
const DistributionUpgrades = lazy(
  async () => import("../DistributionUpgrades"),
);
const TagsAddForm = lazy(async () => import("../TagsAddForm"));
const AttachTokenForm = lazy(
  async () => import("@/features/ubuntupro/components/AttachTokenForm"),
);
const ReplaceTokenForm = lazy(
  async () => import("@/features/ubuntupro/components/ReplaceTokenForm"),
);

interface InstancesPageActionsProps {
  readonly isGettingInstances: boolean;
  readonly toggledInstances: Instance[];
  readonly instanceCount: number;
  readonly areAllInstancesSelected?: boolean;
  readonly query?: string;
}

const InstancesPageActions = ({
  isGettingInstances,
  toggledInstances,
  areAllInstancesSelected,
  instanceCount,
  query,
}: InstancesPageActionsProps) => {
  const { isFeatureEnabled } = useAuth();
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

  const createInstanceCountString = (instances: Instance[]) => {
    return (
      <PluralizeWithBoldCount count={instances.length} singular="instance" />
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

  const handleDistributionUpgradesRequest = () => {
    setSidePanelContent(
      "Upgrade distributions",
      <Suspense fallback={<LoadingState />}>
        <DistributionUpgrades
          selectedInstances={toggledInstances.map(({ id }) => id)}
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

  const noInstanceHasUpgrades =
    !areAllInstancesSelected &&
    toggledInstances.every((instance) => !hasUpgrades(instance.alerts));

  const noInstanceHasPackageFeature =
    !areAllInstancesSelected &&
    toggledInstances.every((instance) => !getFeatures(instance).packages);

  const operationsLinks = [
    {
      children: (
        <>
          <Icon name="power-off" />
          <span>Shut down</span>
        </>
      ),
      onClick: openShutdownModal,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="restart" />
          <span>Restart</span>
        </>
      ),
      onClick: openRebootModal,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="delete" />
          <span>Remove from Landscape</span>
        </>
      ),
      onClick: openRemoveModal,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="arrow-up" />
          <span>Upgrade distributions</span>
        </>
      ),
      onClick: handleDistributionUpgradesRequest,
      hasIcon: true,
      disabled: toggledInstances.every(
        (instance) => !instance.has_release_upgrades,
      ),
    },
    REPORT_VIEW_ENABLED
      ? {
          children: (
            <>
              <Icon name="status" />
              <span>View report</span>
            </>
          ),
          onClick: handleReportView,
          hasIcon: true,
        }
      : {},
    {
      children: (
        <>
          <Icon name="code" />
          <span>Run script</span>
        </>
      ),
      onClick: handleRunScript,
      hasIcon: true,
      disabled: toggledInstances.every(
        (instance) => !getFeatures(instance).scripts,
      ),
    },
  ].filter((link) => link.children);

  const groupingLinks = [
    {
      children: (
        <>
          <Icon name="user-group" />
          <span>Assign access group</span>
        </>
      ),
      onClick: handleAccessGroupChange,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="tag" />
          <span>Assign tag</span>
        </>
      ),
      onClick: handleTagsAssign,
      hasIcon: true,
    },
  ];

  const proServicesLinks = [
    allInstancesHaveToken
      ? {
          children: (
            <>
              <Icon name="change-version" />
              <span>Replace token</span>
            </>
          ),
          onClick: handleReplaceToken,
          hasIcon: true,
        }
      : {
          children: (
            <>
              <Icon name="private-key" />
              <span>Attach token</span>
            </>
          ),
          onClick: handleAttachToken,
          hasIcon: true,
        },
    isFeatureEnabled("ubuntu-pro-licensing")
      ? {
          children: (
            <>
              <Icon name="disconnect" />
              <span>Detach token</span>
            </>
          ),
          onClick: openDetachModal,
          hasIcon: true,
        }
      : {},
  ].filter((link) => link.children);

  const debManagementLinks = [
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
      disabled: noInstanceHasPackageFeature,
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
      disabled: noInstanceHasPackageFeature,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="arrow-down" />
          <span>Downgrade</span>
        </>
      ),
      disabled: noInstanceHasPackageFeature,
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
      disabled: noInstanceHasPackageFeature,
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
      disabled: noInstanceHasPackageFeature,
      hasIcon: true,
    },
  ];

  const bulkActionDisabled =
    (!areAllInstancesSelected && toggledInstances.length <= 0) ||
    (areAllInstancesSelected && toggledInstances.length >= instanceCount) ||
    isGettingInstances;

  const nonBulkActionDisabled = bulkActionDisabled || areAllInstancesSelected;

  return (
    <>
      <ResponsiveButtons
        collapseFrom="sm"
        className={classes.buttons}
        buttons={[
          <ContextualMenu
            key="operations"
            links={operationsLinks}
            position="right"
            toggleLabel="Operations"
            toggleClassName="u-no-margin--bottom"
            toggleDisabled={nonBulkActionDisabled}
            hasToggleIcon
          />,
          <ContextualMenu
            key="grouping"
            links={groupingLinks}
            position="right"
            toggleLabel="Grouping"
            toggleClassName="u-no-margin--bottom"
            toggleDisabled={nonBulkActionDisabled}
            hasToggleIcon
          />,
          hasOneItem(proServicesLinks) ? (
            <Button
              key="pro-services"
              type="button"
              className="u-no-margin--bottom"
              onClick={proServicesLinks[0].onClick}
              disabled={nonBulkActionDisabled}
              hasIcon={proServicesLinks[0].hasIcon}
            >
              {proServicesLinks[0].children}
            </Button>
          ) : (
            <ContextualMenu
              position="right"
              key="pro-services"
              links={proServicesLinks}
              toggleLabel="Ubuntu Pro"
              toggleClassName="u-no-margin--bottom"
              toggleDisabled={nonBulkActionDisabled}
              hasToggleIcon
            />
          ),
          <ContextualMenu
            key="deb-management"
            hasToggleIcon
            links={debManagementLinks}
            position="right"
            toggleLabel={<span>Deb management</span>}
            toggleClassName="u-no-margin--bottom"
            toggleDisabled={bulkActionDisabled}
          />,
        ]}
      />
      {rebootModalOpen && (
        <RestartModal close={closeRebootModal} instances={toggledInstances} />
      )}
      {shutdownModalOpen && (
        <ShutDownModal
          close={closeShutdownModal}
          instances={toggledInstances}
        />
      )}
      {detachModalOpen && (
        <DetachTokenModal
          isOpen={detachModalOpen}
          onClose={closeDetachModal}
          computerIds={toggledInstances.map(({ id }) => id)}
        />
      )}
      <InstanceRemoveFromLandscapeModal
        close={closeRemoveModal}
        instances={toggledInstances}
        isOpen={removeModalOpen}
      />
    </>
  );
};

export default InstancesPageActions;
