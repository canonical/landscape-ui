import type { FC } from "react";
import { useMemo } from "react";
import type { InstalledSnapWithCount, SnapChangeMode } from "../../../../types";
import { useGetSnapInfo } from "../../../../api";
import { isValidRevision, getChannelConfinement } from "../../../../helpers";
import SnapChannelRevisionFields, {
  getChannelOptions,
} from "../../../SnapChannelRevisionFields";
import SnapItemTitleRow from "../SnapItemTitleRow";
import SnapItemSubtitle from "../SnapItemSubtitle";

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
    <>
      <SnapItemTitleRow name={selectedSnap.snap.name} onDelete={onDelete} />
      <SnapItemSubtitle
        scope="Installed"
        computerCount={selectedSnap.computerCount}
      />
      <div>Change to</div>
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
    </>
  );
};

export default SnapChangeChannelItem;
