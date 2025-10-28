import type { FC, RefObject, ReactNode, Ref } from "react";
import { useRef } from "react";
import type { MultiSelectProps } from "@canonical/react-components";
import { MultiSelect } from "@canonical/react-components";
import classNames from "classnames";
import classes from "./MultiSelectField.module.scss";

interface MultiSelectFieldProps extends Omit<MultiSelectProps, "help"> {
  readonly className?: string;
  readonly help?: ReactNode;
  readonly innerRef?: Ref<HTMLDivElement>;
  readonly label?: string;
  readonly labelClassName?: string;
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
  const controlRef = useRef<HTMLButtonElement | HTMLInputElement>(null);
  const dropdownIdRef = useRef("");

  const containerRefCallback = (node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }

    if (innerRef) {
      if (typeof innerRef === "function") {
        innerRef(node);
      } else {
        (innerRef as RefObject<HTMLDivElement>).current = node;
      }
    }

    if (!node.closest(".l-aside")) {
      return;
    }

    const button = node.querySelector<HTMLButtonElement>(
      ".multi-select__select-button",
    );
    const input = node.querySelector<HTMLInputElement>(".p-search-box__input");

    (
      controlRef as RefObject<HTMLButtonElement | HTMLInputElement | null>
    ).current = button || input;

    dropdownIdRef.current =
      controlRef.current?.getAttribute("aria-controls") || "";
  };

  const footer = error ? (
    <div
      className={classNames("p-form-validation p-form__group", {
        "is-error": !!error,
      })}
    >
      <p className="p-form-validation__message">
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
      ref={containerRefCallback}
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
        scrollOverflow
        {...otherProps}
      />
      {error && (
        <p
          className={classNames(
            classes.errorMessage,
            "p-form-validation__message",
          )}
        >
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default MultiSelectField;
