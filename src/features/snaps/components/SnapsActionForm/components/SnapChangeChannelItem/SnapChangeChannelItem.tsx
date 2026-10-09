import type { FC } from "react";
import { useEffect, useMemo, useRef } from "react";
import type { InstalledSnapWithCount, SnapChangeMode } from "../../../../types";
import { useGetSnapInfo } from "../../../../api";
import { isValidRevision, getChannelConfinement } from "../../../../helpers";
import SnapChannelRevisionFields, {
  getChannelOptions,
} from "../../../SnapChannelRevisionFields";
import SnapItemTitleRow from "../SnapItemTitleRow";
import SnapItemSubtitle from "../SnapItemSubtitle";
import classes from "./SnapChangeChannelItem.module.scss";

interface SnapChangeChannelItemProps {
  readonly instanceIds: number[];
  readonly selectedSnap: InstalledSnapWithCount;
  readonly onDelete: () => void;
  readonly mode: SnapChangeMode;
  readonly value: string;
  readonly hasAttemptedSubmit?: boolean;
  readonly onLoadingChange?: (isLoading: boolean) => void;
  readonly onErrorChange?: (isError: boolean) => void;
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
  onLoadingChange,
  onErrorChange,
  onChange,
  onModeChange,
}) => {
  const { snapInfo, isSnapInfoLoading, isSnapInfoError } = useGetSnapInfo({
    instance_id: instanceIds[0] ?? 0,
    name: selectedSnap.snap.name,
  });

  const onLoadingChangeRef = useRef(onLoadingChange);
  const onErrorChangeRef = useRef(onErrorChange);

  useEffect(() => {
    onLoadingChangeRef.current = onLoadingChange;
    onErrorChangeRef.current = onErrorChange;
  });

  useEffect(() => {
    onLoadingChangeRef.current?.(isSnapInfoLoading);
  }, [isSnapInfoLoading]);

  useEffect(() => {
    onErrorChangeRef.current?.(isSnapInfoError);
  }, [isSnapInfoError]);

  useEffect(() => {
    return () => {
      onLoadingChangeRef.current?.(false);
      onErrorChangeRef.current?.(false);
    };
  }, []);

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
      <SnapItemSubtitle
        scope="Installed"
        computerCount={selectedSnap.computerCount}
      />
      <div className={classes.changeToLabel}>Change to</div>
      <SnapChannelRevisionFields
        mode={mode}
        value={value}
        channelOptions={channelOptions}
        snapName={selectedSnap.snap.name}
        error={error}
        isLoading={isSnapInfoLoading}
        onChange={(newValue, isClassicConfinement) => {
          if (mode !== "channel") {
            onChange(
              newValue,
              undefined,
              isClassicConfinement ? "classic" : selectedSnap.confinement,
            );
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
    </>
  );
};

export default SnapChangeChannelItem;
