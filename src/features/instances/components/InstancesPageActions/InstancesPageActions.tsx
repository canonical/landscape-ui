import LoadingState from "@/components/layout/LoadingState";
import { ResponsiveButtons } from "@/components/ui";
import PluralizeWithBoldCount from "@/components/ui/PluralizeWithBoldCount";
import { REPORT_VIEW_ENABLED } from "@/constants";
import { DetachTokenModal } from "@/features/ubuntupro";
import useAuth from "@/hooks/useAuth";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import {
  hasOneItem,
  pluralizeArray,
  pluralizeWithCount,
} from "@/utils/_helpers";
import { Button, ContextualMenu, Icon } from "@canonical/react-components";
import { lazy, memo, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import { getFeatures, hasUpgrades } from "../../helpers";
import InstanceRemoveFromLandscapeModal from "../InstanceRemoveFromLandscapeModal";
import classes from "./InstancesPageActions.module.scss";
import ShutDownModal from "../ShutDownModal";
import RestartModal from "../RestartModal";

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
