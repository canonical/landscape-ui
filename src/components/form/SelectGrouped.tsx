import { FC, FocusEventHandler, ReactNode } from "react";
import classNames from "classnames";
import { SelectOption } from "../../types/SelectOption";

type EmptyOption = {
  enabled: boolean;
  label?: string;
};

export type groupedOption = {
  options: SelectOption[];
  optGroup: string;
};

interface SelectGroupedProps {
  groupedOptions: groupedOption[];
  name: string;
  group: string;
  option: string;
  onChange: (newOption: string, newGroup: string) => void;
  id?: string;
  label?: string;
  error?: ReactNode;
  emptyOption?: EmptyOption;
  onBlur?: FocusEventHandler<HTMLSelectElement>;
  className?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  disabled?: boolean;
  hidden?: boolean;
  required?: boolean;
}

const SelectGrouped: FC<SelectGroupedProps> = ({
  groupedOptions,
  group,
  option,
  onChange,
  error,
  emptyOption,
  name,
  label = "",
  id,
  onBlur,
  className,
  labelClassName,
  wrapperClassName,
  hidden,
  disabled,
  required,
}) => {
  const selectId =
    id ??
    name
      .replace(/[_\s]/g, "-")
      .replace(/([a-z])(?=[A-Z])/, "$1-")
      .replace(/([A-Z])(?=[a-z])/, "-$1")
      .toLowerCase();

  return (
    <div
      className={classNames("p-form-validation", wrapperClassName, {
        "is-error": !!error,
      })}
    >
      {label && (
        <label
          className={classNames("p-form__label", labelClassName, {
            "is-required": required,
          })}
          htmlFor={selectId}
        >
          {label}
        </label>
      )}
      <div className="p-form__control u-clearfix">
        <div className="p-form-validation__select-wrapper">
          <select
            id={selectId}
            value={"" === option ? "" : `${group}/${option}`}
            name={name}
            className={classNames("p-form-validation__input", className)}
            onChange={(event) => {
              onChange(
                event.target[event.target.selectedIndex].dataset.value ?? "",
                event.target[event.target.selectedIndex].dataset.group ?? "",
              );
            }}
            onBlur={onBlur}
            disabled={disabled}
            hidden={hidden}
            aria-invalid={!!error}
            aria-errormessage={
              error ? "pull-pocket-validation-message" : undefined
            }
          >
            {emptyOption && emptyOption.enabled && (
              <option value="" data-group="" data-value="">
                {emptyOption.label ?? ""}
              </option>
            )}
            {groupedOptions.map(({ optGroup, options }) => (
              <optgroup key={optGroup} label={optGroup}>
                {options.map(({ value, label }) => (
                  <option
                    key={value}
                    value={`${optGroup}/${value}`}
                    data-group={optGroup}
                    data-value={value}
                  >
                    {label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        {!!error && (
          <p
            className="p-form-validation__message"
            id="pull-pocket-validation-message"
          >
            <strong>Error:</strong> {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default SelectGrouped;
