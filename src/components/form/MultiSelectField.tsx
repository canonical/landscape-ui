import { FC } from "react";
import { MultiSelect, MultiSelectProps } from "@canonical/react-components";
import classNames from "classnames";

interface MultiSelectFieldProps extends MultiSelectProps {
  label: string;
  labelClassName?: string;
  className?: string;
}

const MultiSelectField: FC<MultiSelectFieldProps> = ({
  label,
  className,
  labelClassName,
  required,
  error,
  ...otherProps
}) => {
  return (
    <div
      className={classNames(
        "p-form-validation p-form__group",
        { "is-error": !!error },
        className,
      )}
    >
      <label
        className={classNames(
          "p-form__label",
          { "is-required": required },
          labelClassName,
        )}
      >
        {label}
      </label>
      <MultiSelect label={label} error={error} {...otherProps} />
      {error && (
        <p className="p-form-validation__message">
          <strong>Error: </strong>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default MultiSelectField;
