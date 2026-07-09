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
  hasOneItem,
  getSelectionLabel,
  pluralize,
  capitalize,
} from "@/utils/_helpers";
import { Button, ContextualMenu, Icon } from "@canonical/react-components";
import { lazy, memo, Suspense } from "react";
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
  readonly selectedInstances: Instance[];
}

const InstancesPageActions = memo(function InstancesPageActions({
  isGettingInstances,
  selectedInstances,
}: InstancesPageActionsProps) {
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
        {selectedInstances.some(
          (instance) => !getFeatures(instance).scripts,
        ) ? (
          <div className={classes.warning}>
            <p>
              You selected{" "}
              {pluralize(selectedInstances.length, ["instance"], "exact")}. This
              script will:
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

  const handleUpgradesRequest = () => {
    setSidePanelContent(
      `Upgrade ${getSelectionLabel(selectedInstances, (toggledInstance) => toggledInstance.title, "instances")}`,
      <Suspense fallback={<LoadingState />}>
        <Upgrades toggledInstances={selectedInstances} />
      </Suspense>,
      "large",
    );
  };

  const handleAllUpgradesRequest = () => {
    setSidePanelContent(
      "Apply all upgrades",
      <Suspense fallback={<LoadingState />}>
        <UpgradesSummary isSelectAllUpgradesEnabled />
      </Suspense>,
      "medium",
    );
  };

  const handleAllSecurityUpgradesRequest = () => {
    setSidePanelContent(
      "Apply all security upgrades",
      <Suspense fallback={<LoadingState />}>
        <UpgradesSummary isSelectAllUpgradesEnabled upgradeType="security" />
      </Suspense>,
      "medium",
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

  const openPackagesActionForm = (action: PackageAction) => {
    setSidePanelContent(
      `${capitalize(action)} packages`,
      <Suspense fallback={<LoadingState />}>
        <PackagesActionForm
          instanceIds={selectedInstances.map(({ id }) => id)}
          action={action}
        />
      </Suspense>,
    );
  };

  const handleReportView = () => {
    setSidePanelContent(
      `Report for ${getSelectionLabel(selectedInstances, (instance) => instance.title, "instances")}`,
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
      `Attach Ubuntu Pro token to ${pluralize(selectedInstances.length, ["instance"], "exact")}`,
      <Suspense fallback={<LoadingState />}>
        <AttachTokenForm selectedInstances={selectedInstances} />
      </Suspense>,
    );
  };

  const handleReplaceToken = () => {
    setSidePanelContent(
      `Replace Ubuntu Pro token for ${pluralize(selectedInstances.length, ["instance"], "exact")}`,
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

  const noInstanceHasUpgrades = selectedInstances.every(
    (instance) =>
      !hasUpgrades(instance.alerts) || !getFeatures(instance).packages,
  );

  const noInstanceHasPackageFeature = selectedInstances.every(
    (instance) => !getFeatures(instance).packages,
  );

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
      disabled:
        isGettingInstances ||
        !selectedInstances.some((instance) => instance.has_release_upgrades),
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
      disabled:
        isGettingInstances ||
        selectedInstances.every((instance) => !getFeatures(instance).scripts),
    },
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
      disabled: selectedInstances.every(
        (instance) =>
          !hasSecurityUpgrades(instance.alerts) ||
          !getFeatures(instance).packages,
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
            toggleDisabled={0 === selectedInstances.length}
            hasToggleIcon
          />,
          <ContextualMenu
            key="grouping"
            links={groupingLinks}
            position="right"
            toggleLabel="Grouping"
            toggleClassName="u-no-margin--bottom"
            toggleDisabled={0 === selectedInstances.length}
            hasToggleIcon
          />,
          hasOneItem(proServicesLinks) ? (
            <Button
              key="pro-services"
              type="button"
              className="u-no-margin--bottom"
              onClick={proServicesLinks[0].onClick}
              disabled={0 === selectedInstances.length}
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
              toggleDisabled={0 === selectedInstances.length}
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
            toggleDisabled={0 === selectedInstances.length}
          />,
        ]}
      />

      {rebootModalOpen && (
        <RestartModal close={closeRebootModal} instances={selectedInstances} />
      )}
      {shutdownModalOpen && (
        <ShutDownModal
          close={closeShutdownModal}
          instances={selectedInstances}
        />
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
