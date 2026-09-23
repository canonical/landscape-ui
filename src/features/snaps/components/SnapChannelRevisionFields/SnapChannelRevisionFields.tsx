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
  error,
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
  );
};

export default SnapChannelRevisionFields;
