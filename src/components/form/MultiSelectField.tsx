import { FC } from "react";
import { MultiSelect, MultiSelectProps } from "@canonical/react-components";
import classNames from "classnames";

interface MultiSelectFieldProps extends MultiSelectProps {
  className?: string;
  label?: string;
  labelClassName?: string;
}

const MultiSelectField: FC<MultiSelectFieldProps> = ({
  error,
  required,
  className,
  label,
  labelClassName,
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
      {label && (
        <label
          className={classNames(
            "p-form__label",
            { "is-required": required },
            labelClassName,
          )}
        >
          {label}
        </label>
      )}
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
