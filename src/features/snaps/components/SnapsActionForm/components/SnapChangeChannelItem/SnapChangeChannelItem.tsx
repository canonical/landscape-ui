import type { FC } from "react";
import { useMemo } from "react";
import classes from "./SnapChangeChannelItem.module.scss";
import { Button, Icon, ICONS } from "@canonical/react-components";
import { pluralize } from "@/utils/_helpers";
import type { InstalledSnapWithCount, SnapChangeMode } from "../../../../types";
import { useGetSnapInfo } from "../../../../api";
import { SnapChannelRevisionFields, getChannelOptions } from "@/features/snaps";

interface SnapChangeChannelItemProps {
  readonly instanceIds: number[];
  readonly selectedSnap: InstalledSnapWithCount;
  readonly onDelete: () => void;
  readonly mode: SnapChangeMode;
  readonly value: string;
  readonly hasAttemptedSubmit?: boolean;
  readonly onChange: (value: string) => void;
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

  const error =
    hasAttemptedSubmit && !value
      ? "Select a channel or revision for this snap to continue"
      : undefined;

  return (
    <li className={classes.selectedContainer}>
      <div className={classes.topRow}>
        <div>
          <strong>
            {selectedSnap.snap.name} {selectedSnap.tracking_channel}
          </strong>
          <div className="u-text--muted u-no-margin">
            Installed on{" "}
            {pluralize(selectedSnap.computerCount, ["instance"], "exact")}
          </div>
        </div>
        <Button
          type="button"
          appearance="link"
          className="u-no-margin--bottom u-no-padding--top"
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
        onChange={onChange}
        onModeChange={onModeChange}
      />
    </li>
  );
};

export default SnapChangeChannelItem;
