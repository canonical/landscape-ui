import { FC, ReactNode, Ref } from "react";
import { MultiSelect, MultiSelectProps } from "@canonical/react-components";
import classNames from "classnames";
import classes from "./MultiSelectField.module.scss";

interface MultiSelectFieldProps extends Omit<MultiSelectProps, "help"> {
  className?: string;
  help?: ReactNode;
  innerRef?: Ref<HTMLDivElement>;
  label?: string;
  labelClassName?: string;
}

const MultiSelectField: FC<MultiSelectFieldProps> = ({
  className,
  disabled,
  disabledItems,
  dropdownFooter,
  error,
  help,
  innerRef,
  items,
  label,
  labelClassName,
  required,
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
      {help && <p className="p-form-help-text">{help}</p>}
      <MultiSelect
        dropdownFooter={footer}
        disabled={disabled}
        disabledItems={disabled ? items : disabledItems}
        error={error}
        items={items}
        label={label}
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
