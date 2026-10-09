import type { FC } from "react";
import { useEffect, useState } from "react";
import { CheckboxInput, Input, Select } from "@canonical/react-components";
import classNames from "classnames";
import type { SelectOption } from "@/types/SelectOption";
import type { SnapChangeMode } from "../../types";
import classes from "./SnapChannelRevisionFields.module.scss";
import { MODE_OPTIONS } from "./helpers";
import { useTheme } from "@/context/theme";

interface SnapChannelRevisionFieldsProps {
  readonly mode: SnapChangeMode;
  readonly value: string;
  readonly channelOptions: SelectOption[];
  readonly snapName: string;
  readonly error?: string;
  readonly isLoading?: boolean;
  readonly onChange: (value: string, isClassicConfinement?: boolean) => void;
  readonly onModeChange: (mode: SnapChangeMode) => void;
}

const SnapChannelRevisionFields: FC<SnapChannelRevisionFieldsProps> = ({
  mode,
  value,
  channelOptions,
  snapName,
  error,
  isLoading = false,
  onChange,
  onModeChange,
}) => {
  const [isClassicConfinement, setIsClassicConfinement] = useState(false);

  const [prevMode, setPrevMode] = useState(mode);
  if (mode !== prevMode) {
    setPrevMode(mode);
    setIsClassicConfinement(false);
  }

  useEffect(() => {
    const [firstChannel] = channelOptions;
    if (mode === "channel" && !value && firstChannel) {
      onChange(firstChannel.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelOptions, mode, value]);

  const { isDarkMode } = useTheme();

  return (
    <>
      <div className={classNames(classes.fieldsRow, !isDarkMode && "is-paper")}>
        <Select
          aria-label={`Snap channel or revision for ${snapName}`}
          options={MODE_OPTIONS}
          value={mode}
          onChange={(event) => {
            onModeChange(event.currentTarget.value as SnapChangeMode);
          }}
        />
        {mode === "channel" ? (
          <Select
            aria-label={`Channel for ${snapName}`}
            disabled={isLoading || channelOptions.length === 0}
            value={value}
            error={error}
            help={
              channelOptions.length === 0 && !error
                ? "No channels were found"
                : undefined
            }
            options={
              channelOptions.length > 0
                ? channelOptions
                : [{ label: "Default channel", value: "" }]
            }
            onChange={(event) => {
              onChange(event.currentTarget.value);
            }}
          />
        ) : (
          <Input
            type="number"
            min={1}
            step={1}
            aria-label={`Revision for ${snapName}`}
            defaultValue={value}
            error={error}
            onBlur={(event) => {
              onChange(event.currentTarget.value, isClassicConfinement);
            }}
          />
        )}
      </div>
      {mode === "revision" ? (
        <CheckboxInput
          label="Use classic confinement"
          className={classes.classicConfinementCheckbox}
          checked={isClassicConfinement}
          onChange={(event) => {
            const { checked } = event.currentTarget;
            setIsClassicConfinement(checked);
            onChange(value, checked);
          }}
        />
      ) : null}
    </>
  );
};

export default SnapChannelRevisionFields;
