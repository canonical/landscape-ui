import type { FC } from "react";
import { useEffect, useState, useMemo, useRef } from "react";
import { Input, Notification, Select } from "@canonical/react-components";
import classNames from "classnames";
import type { SnapWithCount, SnapMode } from "../../types";
import classes from "./SnapChannelRevisionFields.module.scss";
import { MODE_OPTIONS } from "./helpers";
import { useTheme } from "@/context/theme";
import CheckboxInputWithHelp from "@/components/form/CheckboxInputWithHelp";
import { useGetSnapInfo } from "../../api";
import {
  getChannelConfinement,
  getChannelOptions,
  isRevisionTooLarge,
  isValidRevision,
} from "../../helpers";

const CLASSIC_CONFINEMENT_TOOLTIP_MESSAGE =
  "Check the snap store if you're not sure whether this release requires classic confinement.";

interface SnapChannelRevisionFieldsProps {
  readonly instanceIds: number[];
  readonly selectedSnap: SnapWithCount;
  readonly snapModeConfig: {
    mode: SnapMode;
    value: string;
    channel?: string;
    confinement?: string;
  };
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
  snapModeConfig: { mode, value, channel, confinement },
  isLoading = false,
  hasAttemptedSubmit,
  onLoadingChange,
  onErrorChange,
  onChange,
  onModeChange,
}) => {
  const [isClassicConfinement, setIsClassicConfinement] = useState(false);
  const [revisionValue, setRevisionValue] = useState(value);

  const [prevMode, setPrevMode] = useState(mode);
  if (mode !== prevMode) {
    setPrevMode(mode);
    setIsClassicConfinement(false);
  }

  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setRevisionValue(value);
  }

  const { snapInfo, isSnapInfoLoading, isSnapInfoError } = useGetSnapInfo({
    instance_id: instanceIds[0] ?? 0,
    name: selectedSnap.snap.name,
  });

  const channelOptions = useMemo(
    () => getChannelOptions(snapInfo?.["channel-map"]),
    [snapInfo],
  );

  const handleChange = (newValue: string, isClassic?: boolean) => {
    if (mode !== "channel") {
      onChange(newValue, undefined, isClassic ? "classic" : "strict");
      return;
    }

    const channelMap = snapInfo?.["channel-map"];

    onChange(newValue, newValue, getChannelConfinement(channelMap, newValue));
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
      return "This field is required";
    }
    if (mode === "revision" && isRevisionTooLarge(value)) {
      return "Revision number is too large";
    }
    if (mode === "revision" && !isValidRevision(value)) {
      return "Revision must be a positive whole number";
    }
    return undefined;
  };

  const error = getError();

  return (
    <>
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
              channelOptions.length === 0 && !isSnapInfoLoading && !error
                ? "No channels were found"
                : undefined
            }
            options={
              channelOptions.length > 0
                ? channelOptions
                : [
                    {
                      label: isSnapInfoLoading
                        ? "Loading..."
                        : "Default channel",
                      value: "",
                    },
                  ]
            }
            onChange={(event) => {
              handleChange(event.currentTarget.value);
            }}
          />
        ) : (
          <Input
            type="text"
            inputMode="numeric"
            aria-label={`Revision for ${selectedSnap.snap.name}`}
            value={revisionValue}
            error={error}
            onChange={(event) => {
              setRevisionValue(event.currentTarget.value.replace(/\D/g, ""));
            }}
            onBlur={(event) => {
              handleChange(event.currentTarget.value, isClassicConfinement);
            }}
          />
        )}
      </div>
      {mode === "revision" ? (
        <CheckboxInputWithHelp
          label="Use classic confinement"
          wrapperClassName={classes.classicConfinementCheckbox}
          tooltipMessage={CLASSIC_CONFINEMENT_TOOLTIP_MESSAGE}
          checked={isClassicConfinement}
          onChange={(event) => {
            const { checked } = event.currentTarget;
            setIsClassicConfinement(checked);
            onChange(revisionValue, undefined, checked ? "classic" : "strict");
          }}
        />
      ) : null}
      {confinement === "classic" && mode === "channel" && channel ? (
        <Notification
          severity="caution"
          className={classNames(
            classes.classicNotification,
            "u-no-margin--bottom",
          )}
        >
          This release requires classic confinement
        </Notification>
      ) : null}
      {!isSnapInfoLoading &&
      !isSnapInfoError &&
      mode === "channel" &&
      channelOptions.length === 0 ? (
        <CheckboxInputWithHelp
          label="Use classic confinement"
          wrapperClassName={classes.classicConfinementCheckbox}
          tooltipMessage={CLASSIC_CONFINEMENT_TOOLTIP_MESSAGE}
          checked={confinement === "classic"}
          onChange={(event) => {
            const { checked } = event.currentTarget;
            onChange(value, channel, checked ? "classic" : "strict");
          }}
        />
      ) : null}
    </>
  );
};

export default SnapChannelRevisionFields;
