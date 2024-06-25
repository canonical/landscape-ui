import React, { FC } from "react";
import { MultiSelect, MultiSelectProps } from "@canonical/react-components";
import classNames from "classnames";
import classes from "./MultiSelectField.module.scss";

interface MultiSelectFieldProps extends MultiSelectProps {
  className?: string;
  label?: string;
  labelClassName?: string;
  innerRef?: React.Ref<HTMLDivElement>;
}

const MultiSelectField: FC<MultiSelectFieldProps> = ({
  dropdownFooter,
  error,
  required,
  className,
  label,
  labelClassName,
  innerRef,
  ...otherProps
}) => {
  const footer = error ? (
    <div>
      <p className="p-form-validation__message">
        <strong>Error: </strong>
        <span>{error}</span>
      </p>
      {dropdownFooter}
    </div>
  ) : (
    dropdownFooter
  );

  return (
    <div
      className={classNames(
        "p-form-validation p-form__group",
        { "is-error": !!error },
        classes.container,
        className,
      )}
      ref={innerRef}
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
      <MultiSelect
        label={label}
        error={error}
        dropdownFooter={footer}
        {...otherProps}
      />
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
