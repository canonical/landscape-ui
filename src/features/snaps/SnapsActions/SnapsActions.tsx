import { Button } from "@canonical/react-components";
import classNames from "classnames";
import { FC, Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import EditSnap from "../EditSnap";
import classes from "./SnapActions.module.scss";
import InstallSnaps from "../InstallSnaps";
import { getSelectedSnaps } from "../helpers";
import { InstalledSnap } from "@/types/Snap";
import { EditSnapType, getSnapUpgradeCounts } from "../helpers";

interface SnapsActionProps {
  instanceId: number;
  selectedSnapIds: string[];
  installedSnaps: InstalledSnap[];
  sidePanel?: boolean;
}

const SnapsActions: FC<SnapsActionProps> = ({
  instanceId,
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
      : `${action} ${count} ${count === 1 ? "snap" : "snaps"}`;

    setSidePanelContent(
      title,
      <Suspense fallback={<LoadingState />}>
        <EditSnap
          instanceId={instanceId}
          installedSnaps={selectedSnaps}
          type={action}
        />
      </Suspense>,
    );
  };

  const handleInstallSnap = () => {
    setSidePanelContent(
      "Install snap",
      <InstallSnaps instanceId={instanceId} />,
    );
  };

  return (
    <div className={classes.container}>
      {!sidePanel && (
        <Button
          type="button"
          onClick={handleInstallSnap}
          hasIcon
          className={classes.noWrap}
        >
          <i className="p-icon--plus" />
          <span>Install</span>
        </Button>
      )}
      <div
        key="buttons"
        className={classNames("p-segmented-control is-small", classes.noWrap)}
      >
        {singleSnap && sidePanel && (
          <Button
            type="button"
            className="p-segmented-control__button has-icon"
            disabled={0 === selectedSnapIds.length}
            onClick={() => handleEditSnap(EditSnapType.Switch)}
          >
            <i className="p-icon--fork" />
            <span>Switch channel</span>
          </Button>
        )}
        <Button
          type="button"
          className="p-segmented-control__button has-icon"
          disabled={0 === selectedSnapIds.length}
          onClick={() => {
            handleEditSnap(EditSnapType.Uninstall);
          }}
        >
          <i className="p-icon--delete" />
          <span>Uninstall</span>
        </Button>
        {(singleSnap?.held_until === null || !sidePanel) && (
          <Button
            type="button"
            className="p-segmented-control__button has-icon"
            disabled={0 === unheld}
            onClick={() => {
              handleEditSnap(EditSnapType.Hold);
            }}
          >
            <i className="p-icon--pause" />
            <span>Hold</span>
          </Button>
        )}
        {(singleSnap?.held_until !== null || !sidePanel) && (
          <Button
            type="button"
            className="p-segmented-control__button has-icon"
            disabled={0 === held}
            onClick={() => {
              handleEditSnap(EditSnapType.Unhold);
            }}
          >
            <i className="p-icon--play" />
            <span>Unhold</span>
          </Button>
        )}
        <Button
          type="button"
          className="p-segmented-control__button has-icon"
          disabled={0 === selectedSnapIds.length}
          onClick={() => {
            handleEditSnap(EditSnapType.Refresh);
          }}
        >
          <i className="p-icon--change-version" />
          <span>Refresh</span>
        </Button>
      </div>
    </div>
  );
};

export default SnapsActions;
