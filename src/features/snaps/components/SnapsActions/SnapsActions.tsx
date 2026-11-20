import LoadingState from "@/components/layout/LoadingState";
import { ResponsiveButtons } from "@/components/ui";
import useSidePanel from "@/hooks/useSidePanel";
import { capitalize, pluralize } from "@/utils/_helpers";
import { Button, Icon, Modal } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import { MAX_SELECTED_SNAPS } from "../../constants";
import type { InstalledSnap, SnapAction } from "../../types";
import classes from "./SnapActions.module.scss";

const InstanceSnapsActionForm = lazy(
  () => import("../InstanceSnapsActionForm"),
);

interface SnapsActionProps {
  readonly instanceTitle: string;
  readonly selectedSnaps: InstalledSnap[];
  readonly sidePanel?: boolean;
}

// Labels, panel titles and icons match the bulk "Snap management" menu in
// InstancesPageActions.
const SnapsActions: FC<SnapsActionProps> = ({
  instanceTitle,
  selectedSnaps,
  sidePanel = false,
}) => {
  const { setSidePanelContent } = useSidePanel();
  const {
    value: isSnapLimitModalOpen,
    setTrue: openSnapLimitModal,
    setFalse: closeSnapLimitModal,
  } = useBoolean(false);

  const singleSnap = selectedSnaps.length === 1 ? selectedSnaps[0] : null;
  const unheldSnaps = selectedSnaps.filter((s) => s.held_until === null);
  const heldSnaps = selectedSnaps.filter((s) => s.held_until !== null);

  const openForm = (
    title: string,
    action: SnapAction,
    installedSnaps?: InstalledSnap[],
    notice?: ReactNode,
  ) => {
    setSidePanelContent(
      title,
      <Suspense fallback={<LoadingState />}>
        {notice}
        <InstanceSnapsActionForm
          action={action}
          instanceTitle={instanceTitle}
          installedSnaps={installedSnaps}
        />
      </Suspense>,
    );
  };

  const openInstalledSnapsForm = (
    action: SnapAction,
    installedSnaps: InstalledSnap[],
    pluralTitle: string,
    notice?: ReactNode,
  ) => {
    const [onlySnap] = installedSnaps;
    const getSingleSnapTitle = (name: string) =>
      action === "change channel"
        ? `Change channel of ${name}`
        : `${capitalize(action)} ${name}`;

    openForm(
      installedSnaps.length === 1 && onlySnap
        ? getSingleSnapTitle(onlySnap.snap.name)
        : pluralTitle,
      action,
      installedSnaps,
      notice,
    );
  };

  const handleInstall = () => {
    openForm("Install snaps", "install");
  };

  const handleUninstall = () => {
    openInstalledSnapsForm("uninstall", selectedSnaps, "Uninstall snaps");
  };

  // Holding an already held snap replaces its hold with an indefinite one, so
  // Hold acts on the whole selection.
  const handleHold = () => {
    openInstalledSnapsForm("hold", selectedSnaps, "Hold snaps");
  };

  const handleUnhold = () => {
    // Like Run script, say which of the selected snaps the action skips.
    const notice =
      unheldSnaps.length > 0 ? (
        <div className={classes.notice}>
          <p>
            You selected {pluralize(selectedSnaps.length, ["snap"], "exact")}.
            This action will:
          </p>
          <ul>
            <li>
              unhold{" "}
              {pluralize(
                heldSnaps.length,
                ["held snap", "held snaps"],
                "exact",
              )}
            </li>
            <li>
              leave {pluralize(unheldSnaps.length, ["snap"], "exact")} unheld
            </li>
          </ul>
        </div>
      ) : undefined;

    openInstalledSnapsForm("unhold", heldSnaps, "Unhold snaps", notice);
  };

  const handleRefresh = () => {
    openInstalledSnapsForm("refresh", selectedSnaps, "Refresh snaps");
  };

  const handleChangeChannel = () => {
    // Change channel renders channel and revision fields for every snap, so
    // it shares the bulk search's limit.
    if (selectedSnaps.length > MAX_SELECTED_SNAPS) {
      openSnapLimitModal();
      return;
    }

    openInstalledSnapsForm(
      "change channel",
      selectedSnaps,
      "Change snap channel",
    );
  };

  return (
    <div className={classes.container}>
      {!sidePanel && (
        <Button
          type="button"
          onClick={handleInstall}
          hasIcon
          className="u-no-margin--bottom"
        >
          <Icon name="import" />
          <span>Install</span>
        </Button>
      )}
      <ResponsiveButtons
        // The table toolbar has five actions beside the search box, so it
        // collapses as early as the Packages tab's. The details panel keeps
        // its original breakpoint.
        collapseFrom={sidePanel ? "lg" : "xl"}
        buttons={[
          <Button
            type="button"
            key="uninstall"
            className="p-segmented-control__button has-icon u-no-margin--bottom"
            disabled={selectedSnaps.length === 0}
            onClick={handleUninstall}
            hasIcon
          >
            <Icon name="close" />
            <span>Uninstall</span>
          </Button>,
          (singleSnap?.held_until === null || !sidePanel) && (
            <Button
              key="hold"
              type="button"
              className="p-segmented-control__button has-icon u-no-margin--bottom"
              disabled={selectedSnaps.length === 0}
              onClick={handleHold}
              hasIcon
            >
              <Icon name="pause" />
              <span>Hold</span>
            </Button>
          ),
          (singleSnap?.held_until !== null || !sidePanel) && (
            <Button
              key="unhold"
              type="button"
              className="p-segmented-control__button has-icon u-no-margin--bottom"
              disabled={0 === heldSnaps.length}
              onClick={handleUnhold}
              hasIcon
            >
              <Icon name="play" />
              <span>Unhold</span>
            </Button>
          ),
          <Button
            key="refresh"
            type="button"
            className="p-segmented-control__button has-icon u-no-margin--bottom"
            disabled={selectedSnaps.length === 0}
            onClick={handleRefresh}
            hasIcon
          >
            <Icon name="restart" />
            <span>Refresh</span>
          </Button>,
          <Button
            key="change-channel"
            type="button"
            className="p-segmented-control__button has-icon u-no-margin--bottom"
            disabled={selectedSnaps.length === 0}
            onClick={handleChangeChannel}
            hasIcon
          >
            <Icon name="change-version" />
            <span>Change channel</span>
          </Button>,
        ]}
      />
      {isSnapLimitModalOpen && (
        <Modal
          close={closeSnapLimitModal}
          title="Snap limit exceeded"
          buttonRow={
            <Button appearance="positive" onClick={closeSnapLimitModal}>
              OK
            </Button>
          }
        >
          <p className="u-margin--bottom">
            You can only change channels on a maximum of{" "}
            {pluralize(MAX_SELECTED_SNAPS, ["snap"], "exact")} at once.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default SnapsActions;
