import type { FC } from "react";
import { useEffect, useMemo, useRef } from "react";
import { Input, Select } from "@canonical/react-components";
import classNames from "classnames";
import type { InstalledSnapWithCount, SnapMode } from "../../types";
import classes from "./SnapChannelRevisionFields.module.scss";
import { getChannelOptions, MODE_OPTIONS } from "./helpers";
import { useTheme } from "@/context/theme";
import { useGetSnapInfo } from "../../api";
import { getChannelConfinement, isValidRevision } from "../../helpers";

interface SnapChannelRevisionFieldsProps {
  readonly instanceIds: number[];
  readonly selectedSnap: InstalledSnapWithCount;
  readonly mode: SnapMode;
  readonly value: string;
  readonly isLoading?: boolean;
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

const SnapChannelRevisionFields: FC<SnapChannelRevisionFieldsProps> = ({
  instanceIds,
  selectedSnap,
  mode,
  value,
  isLoading = false,
  hasAttemptedSubmit,
  onLoadingChange,
  onErrorChange,
  onChange,
  onModeChange,
}) => {
  const { snapInfo, isSnapInfoLoading, isSnapInfoError } = useGetSnapInfo({
    instance_id: instanceIds[0] ?? 0,
    name: selectedSnap.snap.name,
  });

  const channelOptions = useMemo(
    () => getChannelOptions(snapInfo?.["channel-map"]),
    [snapInfo],
  );

  const handleChange = (newValue: string) => {
    const channelMap = snapInfo?.["channel-map"];

    onChange(
      newValue,
      mode === "channel" ? newValue : undefined,
      getChannelConfinement(channelMap, newValue) ?? selectedSnap.confinement,
    );
  };

  useEffect(() => {
    const [firstChannel] = channelOptions;
    if (mode === "channel" && !value) {
      handleChange(firstChannel?.value ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelOptions, mode, value]);

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

  const { isDarkMode } = useTheme();

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
    <div className={classNames(classes.fieldsRow, !isDarkMode && "is-paper")}>
      <Select
        aria-label={`Snap channel or revision for ${selectedSnap.snap.name}`}
        options={MODE_OPTIONS}
        value={mode}
        onChange={(event) => {
          onModeChange(event.currentTarget.value as SnapMode);
        }}
      />
      {mode === "channel" ? (
        <Select
          aria-label={`Channel for ${selectedSnap.snap.name}`}
          disabled={isLoading || channelOptions.length === 0}
          value={value}
          error={error}
          help={
            channelOptions.length === 0 ? "No channels were found" : undefined
          }
          options={
            channelOptions.length > 0
              ? channelOptions
              : [{ label: "Default channel", value: "" }]
          }
          onChange={(event) => {
            handleChange(event.currentTarget.value);
          }}
        />
      ) : (
        <Input
          type="number"
          min={1}
          step={1}
          aria-label={`Revision for ${selectedSnap.snap.name}`}
          defaultValue={value}
          error={error}
          onBlur={(event) => {
            handleChange(event.currentTarget.value);
          }}
        />
      )}
    </div>
  );
};

export default SnapChannelRevisionFields;
