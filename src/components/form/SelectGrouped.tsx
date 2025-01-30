import type { FC, FocusEventHandler, ReactNode } from "react";
import classNames from "classnames";
import type { SelectOption } from "@/types/SelectOption";

interface EmptyOption {
  enabled: boolean;
  label?: string;
}

export interface groupedOption {
  options: SelectOption[];
  optGroup: string;
}

interface SelectGroupedProps {
  readonly groupedOptions: groupedOption[];
  readonly name: string;
  readonly group: string;
  readonly option: string;
  readonly onChange: (newOption: string, newGroup: string) => void;
  readonly id?: string;
  readonly label?: string;
  readonly error?: ReactNode;
  readonly emptyOption?: EmptyOption;
  readonly onBlur?: FocusEventHandler<HTMLSelectElement>;
  readonly className?: string;
  readonly labelClassName?: string;
  readonly wrapperClassName?: string;
  readonly disabled?: boolean;
  readonly hidden?: boolean;
  readonly required?: boolean;
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
