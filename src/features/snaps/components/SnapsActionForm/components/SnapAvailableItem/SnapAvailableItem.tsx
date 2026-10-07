import type { FC } from "react";
import { useEffect, useMemo } from "react";
import type { InstalledSnapWithCount, SnapMode } from "../../../../types";
import { useGetSnapInfo } from "../../../../api";
import { isValidRevision, getChannelConfinement } from "../../../../helpers";
import SnapChannelRevisionFields, {
  getChannelOptions,
} from "../../../SnapChannelRevisionFields";
import SnapItemTitleRow from "../SnapItemTitleRow";
import { Notification } from "@canonical/react-components";
import classNames from "classnames";
import classes from "./SnapAvailableItem.module.scss";

interface SnapAvailableItemProps {
  readonly instanceIds: number[];
  readonly selectedSnap: InstalledSnapWithCount;
  readonly onDelete: () => void;
  readonly mode: SnapMode;
  readonly value: string;
  readonly hasAttemptedSubmit?: boolean;
  readonly onLoadingChange?: (isLoading: boolean) => void;
  readonly onErrorChange?: (isError: boolean) => void;
  readonly onChange: (
    value: string,
    channel?: string,
    confinement?: string,
  ) => void;
  readonly onModeChange: (mode: SnapMode) => void;
}

const SnapAvailableItem: FC<SnapAvailableItemProps> = ({
  instanceIds,
  selectedSnap,
  onDelete,
  mode,
  value,
  hasAttemptedSubmit = false,
  onLoadingChange,
  onErrorChange,
  onChange,
  onModeChange,
}) => {
  const { snapInfo, isSnapInfoLoading, isSnapInfoError } = useGetSnapInfo({
    instance_id: instanceIds[0] ?? 0,
    name: selectedSnap.snap.name,
  });

  useEffect(() => {
    onLoadingChange?.(isSnapInfoLoading);
    return () => {
      onLoadingChange?.(false);
    };
  }, [isSnapInfoLoading, onLoadingChange]);

  useEffect(() => {
    onErrorChange?.(isSnapInfoError);
    return () => {
      onErrorChange?.(false);
    };
  }, [isSnapInfoError, onErrorChange]);

  const channelOptions = useMemo(
    () => getChannelOptions(snapInfo?.["channel-map"]),
    [snapInfo],
  );

  const getError = () => {
    if (mode === "channel" && isSnapInfoError) {
      return "Failed to load channels for this snap";
    }
    if (!hasAttemptedSubmit) {
      return undefined;
    }
    if (mode === "revision" && !value) {
      return "Select a revision for this snap to continue";
    }
    if (mode === "revision" && !isValidRevision(value)) {
      return "Revision must be a positive whole number";
    }
    return undefined;
  };

  const error = getError();

  return (
    <>
      <SnapItemTitleRow name={selectedSnap.snap.name} onDelete={onDelete} />
      <SnapChannelRevisionFields
        mode={mode}
        value={value}
        channelOptions={channelOptions}
        snapName={selectedSnap.snap.name}
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
      {selectedSnap.confinement === "classic" ? (
        <Notification
          severity="caution"
          className={classNames(classes.notification, "u-no-margin--bottom")}
        >
          This snap requires classic confinement
        </Notification>
      ) : null}
    </>
  );
};

export default SnapAvailableItem;
