import { CSSProperties, FC, FocusEventHandler, ReactNode } from "react";
import { SelectOption } from "../../types/SelectOption";
import classNames from "classnames";
import { CheckboxInput } from "@canonical/react-components";
import classes from "./CheckboxGroup.module.scss";

interface CheckboxGroupProps {
  name: string;
  label: string;
  options: SelectOption[];
  value: string[];
  onChange: (newValue: string[]) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  style?: CSSProperties;
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
}) => {
  return (
    <fieldset
      className={classNames(
        "checkbox-group",
        {
          "is-error": error,
        },
        className
      )}
      style={style}
    >
      <legend className={classNames({ [classes.required]: required })}>
        {label}
      </legend>

      {!!error && <p className="p-form-validation__message">{error}</p>}

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
