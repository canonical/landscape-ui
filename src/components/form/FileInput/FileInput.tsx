import { ChangeEvent, FC, FocusEvent, useState } from "react";
import classNames from "classnames";
import { Button, Icon, Input, InputProps } from "@canonical/react-components";

interface FileInputProps
  extends Omit<InputProps, "multiple" | "onChange" | "type" | "value"> {
  onFileRemove: () => Promise<void>;
  onFileUpload: (files: File[]) => Promise<void>;
  value: File | null;
}

const FileInput: FC<FileInputProps> = ({
  error,
  help,
  label,
  onBlur,
  onFileRemove,
  onFileUpload,
  value,
  ...inputProps
}) => {
  const [focusEvent, setFocusEvent] =
    useState<FocusEvent<HTMLInputElement> | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || !files.length) {
      return;
    }

    await onFileUpload([...files]);

    if (focusEvent && onBlur) {
      onBlur(focusEvent);
    }
  };

  return value ? (
    <div
      className={classNames("p-form__group p-form-validation", {
        "is-error": error,
      })}
    >
      {label && <label className="p-form-validation__label">{label}</label>}
      {help && <p className="p-form-help-text">{help}</p>}
      <span>{value.name}</span>
      <Button
        type="button"
        appearance="base"
        hasIcon
        dense
        onClick={onFileRemove}
        className="u-no-padding--left"
        aria-errormessage={`${value.name}-error-message`}
        style={{ marginLeft: "0.5rem" }}
      >
        <span className="u-off-screen">Remove</span>
        <Icon name="delete" />
      </Button>
      {error && (
        <p
          className="p-form-validation__message"
          id={`${value.name}-error-message`}
        >
          <strong>Error: </strong>
          <span>{error}</span>
        </p>
      )}
    </div>
  ) : (
    <Input
      {...inputProps}
      type="file"
      error={error}
      help={help}
      label={label}
      multiple={false}
      onBlur={(event) => setFocusEvent(event)}
      onChange={handleFileChange}
    />
  );
};

export default FileInput;
