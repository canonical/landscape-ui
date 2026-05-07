import type { FC } from "react";
import { CheckboxInput, Textarea } from "@canonical/react-components";
import type { GpgKey } from "@canonical/landscape-openapi";

interface GpgKeyFieldProps {
  readonly existingKey?: GpgKey;
  readonly keepCurrentKey: boolean;
  readonly gpgKeyValue?: string;
  readonly gpgKeyError?: string;
  readonly keepCurrentLabel?: string;
  readonly textareaLabel?: string;
  readonly onKeepCurrentChange: (checked: boolean) => void;
  readonly onGpgKeyChange: (value: string) => void;
  readonly onGpgKeyBlur?: () => void;
}

const GpgKeyField: FC<GpgKeyFieldProps> = ({
  existingKey,
  keepCurrentKey,
  gpgKeyValue,
  gpgKeyError,
  keepCurrentLabel = "Keep current GPG key",
  textareaLabel = "GPG key",
  onKeepCurrentChange,
  onGpgKeyChange,
  onGpgKeyBlur,
}) => {
  if (existingKey) {
    return (
      <>
        <CheckboxInput
          label={keepCurrentLabel}
          checked={keepCurrentKey}
          onChange={(e) => {
            onKeepCurrentChange(e.target.checked);
          }}
        />
        {!keepCurrentKey && (
          <Textarea
            label={textareaLabel}
            value={gpgKeyValue ?? ""}
            error={gpgKeyError}
            onChange={(e) => {
              onGpgKeyChange(e.target.value);
            }}
            onBlur={onGpgKeyBlur}
          />
        )}
      </>
    );
  }

  return (
    <Textarea
      label={textareaLabel}
      value={gpgKeyValue ?? ""}
      error={gpgKeyError}
      onChange={(e) => {
        onGpgKeyChange(e.target.value);
      }}
      onBlur={onGpgKeyBlur}
    />
  );
};

export default GpgKeyField;
