import type { FC } from "react";
import { useMemo } from "react";
import classes from "./SnapChangeChannelItem.module.scss";
import { Button, Icon, ICONS } from "@canonical/react-components";
import { pluralize } from "@/utils/_helpers";
import type { InstalledSnapWithCount, SnapChangeMode } from "../../../../types";
import { useGetSnapInfo } from "../../../../api";
import { isValidRevision, getChannelConfinement } from "../../../../helpers";
import SnapChannelRevisionFields, {
  getChannelOptions,
} from "../../../SnapChannelRevisionFields";

interface SnapChangeChannelItemProps {
  readonly instanceIds: number[];
  readonly selectedSnap: InstalledSnapWithCount;
  readonly onDelete: () => void;
  readonly mode: SnapChangeMode;
  readonly value: string;
  readonly hasAttemptedSubmit?: boolean;
  readonly onChange: (
    value: string,
    channel?: string,
    confinement?: string,
  ) => void;
  readonly onModeChange: (mode: SnapChangeMode) => void;
}

const SnapChangeChannelItem: FC<SnapChangeChannelItemProps> = ({
  instanceIds,
  selectedSnap,
  onDelete,
  mode,
  value,
  hasAttemptedSubmit = false,
  onChange,
  onModeChange,
}) => {
  const { snapInfo, isSnapInfoLoading } = useGetSnapInfo({
    instance_id: instanceIds[0] ?? 0,
    name: selectedSnap.snap.name,
  });

  const channelOptions = useMemo(
    () => getChannelOptions(snapInfo?.["channel-map"]),
    [snapInfo],
  );

  const getError = () => {
    if (!hasAttemptedSubmit) {
      return undefined;
    }
    if (!value) {
      return "Select a channel or revision for this snap to continue";
    }
    if (mode === "revision" && !isValidRevision(value)) {
      return "Revision must be a positive whole number";
    }
    return undefined;
  };

  const error = getError();

  return (
    <li className={classes.selectedContainer}>
      <div className={classes.topRow}>
        <div>
          <strong>{selectedSnap.snap.name}</strong>
          <div className="u-text--muted u-no-margin">
            Installed on{" "}
            {pluralize(selectedSnap.computerCount, ["instance"], "exact")}
          </div>
        </div>
        <Button
          type="button"
          appearance="base"
          className={classes.deleteButton}
          aria-label={`Delete ${selectedSnap.snap.name}`}
          onClick={onDelete}
        >
          <Icon name={ICONS.delete} />
        </Button>
      </div>
      <SnapChannelRevisionFields
        mode={mode}
        value={value}
        channelOptions={channelOptions}
        snapName={selectedSnap.snap.name}
        modeLabel="Change to"
        error={error}
        isLoading={isSnapInfoLoading}
        onChange={(newValue) => {
          if (mode !== "channel") {
            onChange(newValue);
            return;
          }

          const channelMap = snapInfo?.["channel-map"];
          onChange(
            newValue,
            newValue,
            getChannelConfinement(channelMap, newValue),
          );
        }}
        onModeChange={onModeChange}
      />
    </li>
  );
};

export default SnapChangeChannelItem;
