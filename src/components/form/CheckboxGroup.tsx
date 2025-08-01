import type { CSSProperties, FC, FocusEventHandler, ReactNode } from "react";
import type { SelectOption } from "../../types/SelectOption";
import classNames from "classnames";
import { CheckboxInput } from "@canonical/react-components";
import classes from "./CheckboxGroup.module.scss";

interface CheckboxGroupProps {
  readonly name: string;
  readonly label: string;
  readonly options: SelectOption[];
  readonly value: string[];
  readonly onChange: (newValue: string[]) => void;
  readonly onBlur?: FocusEventHandler<HTMLInputElement>;
  readonly error?: ReactNode;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly help?: ReactNode;
}

const CheckboxGroup: FC<CheckboxGroupProps> = ({
  options,
  label,
  value,
  onChange,
  required,
  error,
  className,
  onBlur,
  name,
  style,
  disabled,
  help,
}) => {
  return (
    <fieldset
      className={classNames(
        "checkbox-group",
        classes.container,
        { "is-error": error },
        className,
      )}
      disabled={disabled}
      style={style}
    >
      <legend className={classNames({ [classes.required]: required })}>
        {label}
      </legend>

      {!!error && <p className="p-form-validation__message">{error}</p>}
      {help && <p className="p-form-help-text">{help}</p>}
      <div className="checkbox-group__inner">
        {options.map((option) => (
          <CheckboxInput
            key={option.value}
            label={option.label}
            name={name}
            value={option.value}
            checked={value.includes(option.value)}
            onChange={() => {
              if (value.includes(option.value)) {
                onChange(value.filter((v) => v !== option.value));
              } else {
                onChange([...value, option.value]);
              }
            }}
            onBlur={onBlur}
          />
        ))}
      </div>
    </fieldset>
  );
};

export default CheckboxGroup;
