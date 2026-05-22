import { ResponsiveButtons } from "@/components/ui";
import { REPORT_VIEW_ENABLED } from "@/constants";
import { DetachTokenModal } from "@/features/ubuntupro";
import useAuth from "@/hooks/useAuth";
import usePageParams from "@/hooks/usePageParams";
import type { Instance } from "@/types/Instance";
import { hasOneItem } from "@/utils/_helpers";
import { Button, ContextualMenu, Icon } from "@canonical/react-components";
import { memo } from "react";
import { useBoolean } from "usehooks-ts";
import { getFeatures, hasUpgrades } from "../../helpers";
import InstanceRemoveFromLandscapeModal from "../InstanceRemoveFromLandscapeModal";
import classes from "./InstancesPageActions.module.scss";
import ShutDownModal from "../ShutDownModal";
import RestartModal from "../RestartModal";

interface InstancesPageActionsProps {
  readonly isGettingInstances: boolean;
  readonly selectedInstances: Instance[];
}

const InstancesPageActions = memo(function InstancesPageActions({
  isGettingInstances,
  selectedInstances,
}: InstancesPageActionsProps) {
  const { isFeatureEnabled } = useAuth();
  const { createSidePathPusher } = usePageParams();

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

  const handleRunScript = createSidePathPusher("run-script");
  const handleUpgradesRequest = createSidePathPusher("upgrades");
  const handleDistributionUpgradesRequest = createSidePathPusher(
    "distribution-upgrades",
  );
  const handleReportView = createSidePathPusher("report-view");
  const handleAccessGroupChange = createSidePathPusher("access-group-change");
  const handleTagsAssign = createSidePathPusher("tags-assign");
  const handleAttachToken = createSidePathPusher("attach-token");
  const handleReplaceToken = createSidePathPusher("replace-token");

  const allInstancesHaveToken = selectedInstances.every(
    (instance) =>
      instance.ubuntu_pro_info?.result === "success" &&
      instance.ubuntu_pro_info.attached,
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
          <Icon name="change-version" />
          <span>Upgrade</span>
        </>
      ),
      onClick: handleUpgradesRequest,
      hasIcon: true,
      disabled:
        selectedInstances.every((instance) => !hasUpgrades(instance.alerts)) ||
        isGettingInstances,
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
