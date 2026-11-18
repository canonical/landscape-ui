import LoadingState from "@/components/layout/LoadingState";
import { ResponsiveButtons } from "@/components/ui";
import useSidePanel from "@/hooks/useSidePanel";
import { capitalize } from "@/utils/_helpers";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
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

  const singleSnap = selectedSnaps.length === 1 ? selectedSnaps[0] : null;
  const unheldSnaps = selectedSnaps.filter((s) => s.held_until === null);
  const heldSnaps = selectedSnaps.filter((s) => s.held_until !== null);

  const openForm = (
    title: string,
    action: SnapAction,
    installedSnaps?: InstalledSnap[],
  ) => {
    setSidePanelContent(
      title,
      <Suspense fallback={<LoadingState />}>
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
    );
  };

  const handleInstall = () => {
    openForm("Install snaps", "install");
  };

  const handleUninstall = () => {
    openInstalledSnapsForm("uninstall", selectedSnaps, "Uninstall snaps");
  };

  const handleHold = () => {
    openInstalledSnapsForm("hold", unheldSnaps, "Hold snaps");
  };

  const handleUnhold = () => {
    openInstalledSnapsForm("unhold", heldSnaps, "Unhold snaps");
  };

  const handleRefresh = () => {
    openInstalledSnapsForm("refresh", selectedSnaps, "Refresh snaps");
  };

  const handleChangeChannel = () => {
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
              disabled={0 === unheldSnaps.length}
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
    </div>
  );
};

export default SnapsActions;
