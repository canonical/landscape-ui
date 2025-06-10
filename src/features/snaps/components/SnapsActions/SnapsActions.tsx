import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon, ICONS } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { Suspense } from "react";
import {
  EditSnapType,
  getSelectedSnaps,
  getSnapUpgradeCounts,
} from "../../helpers";
import type { InstalledSnap } from "../../types";
import EditSnap from "../EditSnap";
import InstallSnaps from "../InstallSnaps";
import classes from "./SnapActions.module.scss";
import { pluralize } from "@/utils/_helpers";
import { ResponsiveButtons } from "@/components/ui";

interface SnapsActionProps {
  readonly selectedSnapIds: string[];
  readonly installedSnaps: InstalledSnap[];
  readonly sidePanel?: boolean;
}

const SnapsActions: FC<SnapsActionProps> = ({
  selectedSnapIds,
  installedSnaps,
  sidePanel = false,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const singleSnap = installedSnaps.length === 1 ? installedSnaps[0] : null;
  const selectedSnaps = getSelectedSnaps(installedSnaps, selectedSnapIds);
  const { held, unheld } = getSnapUpgradeCounts(selectedSnaps);

  const handleEditSnap = (action: EditSnapType) => {
    const count =
      action === EditSnapType.Unhold
        ? held
        : action === EditSnapType.Hold
          ? unheld
          : selectedSnapIds.length;

    const title = singleSnap
      ? `${action} ${singleSnap.snap.name}${action === EditSnapType.Switch ? "'s channel" : ""}`
      : `${action} ${count} ${pluralize(count, "snap")}`;

    setSidePanelContent(
      title,
      <Suspense fallback={<LoadingState />}>
        <EditSnap installedSnaps={selectedSnaps} type={action} />
      </Suspense>,
    );
  };

  const handleInstallSnap = () => {
    setSidePanelContent("Install snaps", <InstallSnaps />);
  };

  return (
    <div className={classes.container}>
      {!sidePanel && (
        <Button
          type="button"
          onClick={handleInstallSnap}
          hasIcon
          className={classNames("u-no-margin--bottom", classes.noWrap)}
        >
          <Icon name={ICONS.plus} />
          <span>Install</span>
        </Button>
      )}
      <ResponsiveButtons
        collapseFrom="lg"
        buttons={[
          singleSnap && sidePanel && (
            <Button
              key="switch-channel"
              type="button"
              className="p-segmented-control__button has-icon u-no-margin--bottom"
              disabled={0 === selectedSnapIds.length}
              onClick={() => {
                handleEditSnap(EditSnapType.Switch);
              }}
            >
              <Icon name="fork" />
              <span>Switch channel</span>
            </Button>
          ),
          <Button
            type="button"
            key="uninstall"
            className="p-segmented-control__button has-icon u-no-margin--bottom"
            disabled={0 === selectedSnapIds.length}
            onClick={() => {
              handleEditSnap(EditSnapType.Uninstall);
            }}
          >
            <Icon name={ICONS.delete} />
            <span>Uninstall</span>
          </Button>,
          (singleSnap?.held_until === null || !sidePanel) && (
            <Button
              key="hold"
              type="button"
              className="p-segmented-control__button has-icon u-no-margin--bottom"
              disabled={0 === unheld}
              onClick={() => {
                handleEditSnap(EditSnapType.Hold);
              }}
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
              disabled={0 === held}
              onClick={() => {
                handleEditSnap(EditSnapType.Unhold);
              }}
            >
              <Icon name="play" />
              <span>Unhold</span>
            </Button>
          ),
          <Button
            key="refresh"
            type="button"
            className="p-segmented-control__button has-icon u-no-margin--bottom"
            disabled={0 === selectedSnapIds.length}
            onClick={() => {
              handleEditSnap(EditSnapType.Refresh);
            }}
          >
            <Icon name="change-version" />
            <span>Refresh</span>
          </Button>,
        ]}
      />
    </div>
  );
};

export default SnapsActions;
