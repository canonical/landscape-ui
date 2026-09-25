import type { FC } from "react";
import { useEffect } from "react";
import { Input, Notification, Select } from "@canonical/react-components";
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
  readonly modeLabel?: string;
  readonly error?: string;
  readonly isLoading?: boolean;
  readonly onChange: (value: string) => void;
  readonly onModeChange: (mode: SnapChangeMode) => void;
}

const SnapChannelRevisionFields: FC<SnapChannelRevisionFieldsProps> = ({
  mode,
  value,
  channelOptions,
  snapName,
  modeLabel,
  error,
  isLoading = false,
  onChange,
  onModeChange,
}) => {
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
      {modeLabel && <div>{modeLabel}</div>}
      <div className={`${classes.fieldsRow} ${!isDarkMode ? "is-paper" : ""}`}>
        <Select
          aria-label="Snap channel or revision"
          value={mode}
          options={MODE_OPTIONS}
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
            options={
              channelOptions.length > 0
                ? channelOptions
                : [{ label: "No channels available", value: "" }]
            }
            onChange={(event) => {
              onChange(event.currentTarget.value);
            }}
          />
        ) : (
          <Input
            type="text"
            aria-label={`Revision for ${snapName}`}
            defaultValue={value}
            error={error}
            onBlur={(event) => {
              onChange(event.currentTarget.value);
            }}
          />
        )}
      </div>
      {mode === "revision" && (
        <Notification
          severity="information"
          title="Choosing revision will install the channel that has that revision published, but will continue tracking the current channel."
        >
          <a href="docs-link">Learn more</a>
        </Notification>
      )}
    </>
  );
};

export default SnapChannelRevisionFields;
