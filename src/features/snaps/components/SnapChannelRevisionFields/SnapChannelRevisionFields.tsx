import type { FC } from "react";
import { Input, Select } from "@canonical/react-components";
import type { SelectOption } from "@/types/SelectOption";
import type { SnapChangeMode } from "../../types";
import classes from "./SnapChannelRevisionFields.module.scss";
import { MODE_OPTIONS } from "./helpers";

interface SnapChannelRevisionFieldsProps {
  readonly mode: SnapChangeMode;
  readonly value: string;
  readonly channelOptions: SelectOption[];
  readonly snapName: string;
  readonly isLoading?: boolean;
  readonly onChange: (value: string) => void;
  readonly onModeChange: (mode: SnapChangeMode) => void;
}

const SnapChannelRevisionFields: FC<SnapChannelRevisionFieldsProps> = ({
  mode,
  value,
  channelOptions,
  snapName,
  isLoading = false,
  onChange,
  onModeChange,
}) => {
  if (mode === "channel" && !value) {
    const [firstChannel] = channelOptions;
    if (firstChannel) {
      onChange(firstChannel.value);
    }
  }

  return (
    <div className={classes.fieldsRow}>
      <Select
        label={<span className="u-text--muted p-text--small">Change to</span>}
        aria-label="Change to"
        value={mode}
        options={MODE_OPTIONS}
        onChange={(event) => {
          onModeChange(event.currentTarget.value as SnapChangeMode);
        }}
      />
      {mode === "channel" ? (
        <Select
          label={<span className="u-text--muted p-text--small">Channel</span>}
          aria-label={`Channel for ${snapName}`}
          disabled={isLoading || channelOptions.length === 0}
          value={value}
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
          label={<span className="u-text--muted p-text--small">Revision</span>}
          aria-label={`Revision for ${snapName}`}
          defaultValue={value}
          onBlur={(event) => {
            onChange(event.currentTarget.value);
          }}
        />
      )}
    </div>
  );
};

export default SnapChannelRevisionFields;
