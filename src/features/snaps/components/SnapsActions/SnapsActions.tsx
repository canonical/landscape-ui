import { ResponsiveButtons } from "@/components/ui";
import { pluralize } from "@/utils/_helpers";
import usePageParams from "@/hooks/usePageParams";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import {
  EditSnapType,
  getSelectedSnaps,
  getSnapUpgradeCounts,
} from "../../helpers";
import type { InstalledSnap } from "../../types";
import classes from "./SnapActions.module.scss";

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
  const { setPageParams, createSidePathPusher } = usePageParams();

  const singleSnap = installedSnaps.length === 1 ? installedSnaps[0] : null;
  const selectedSnaps = getSelectedSnaps(installedSnaps, selectedSnapIds);
  const { held, unheld } = getSnapUpgradeCounts(selectedSnaps);

  const handleEditSnap = (action: EditSnapType) => {
    if (sidePanel) {
      createSidePathPusher(action.toLowerCase())();
    } else {
      setPageParams({
        sidePath: [action.toLowerCase()],
        ...(singleSnap ? { name: singleSnap.snap.name } : {}),
      });
    }
  };

  const handleInstallSnap = createSidePathPusher("install");

  return (
    <div className={classes.container}>
      {!sidePanel && (
        <Button
          type="button"
          onClick={handleInstallSnap}
          hasIcon
          className="u-no-margin--bottom"
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
              hasIcon
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
            hasIcon
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
              disabled={0 === held}
              onClick={() => {
                handleEditSnap(EditSnapType.Unhold);
              }}
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
            disabled={0 === selectedSnapIds.length}
            onClick={() => {
              handleEditSnap(EditSnapType.Refresh);
            }}
            hasIcon
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
