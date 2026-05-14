import type { FC, RefObject, ReactNode, Ref } from "react";
import { useRef, useEffect } from "react";
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
  readonly onOpen?: () => void;
  readonly onClose?: () => void;
  readonly warning?: ReactNode;
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
  onOpen,
  onClose,
  required,
  warning,
  ...otherProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep the latest callbacks in refs so the MutationObserver always
  // calls the most recent version without needing to re-observe.
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
  });

  // Watch aria-expanded on the Canonical control element. This is the only
  // reliable signal for open/close — the dropdown is portalled so focus/blur
  // events on the wrapper are unreliable.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // MultiSelect renders its button synchronously, so it is in the DOM
    // by the time this effect runs (after first paint).
    const control = container.querySelector<HTMLElement>("[aria-expanded]");
    if (!control) return;

    const observer = new MutationObserver(() => {
      if (control.getAttribute("aria-expanded") === "true") {
        onOpenRef.current?.();
      } else {
        onCloseRef.current?.();
      }
    });

    observer.observe(control, {
      attributes: true,
      attributeFilter: ["aria-expanded"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const containerRefCallback = (node: HTMLDivElement | null) => {
    (containerRef as RefObject<HTMLDivElement | null>).current = node;

    if (!node) return;

    if (innerRef) {
      if (typeof innerRef === "function") {
        innerRef(node);
      } else {
        (innerRef as RefObject<HTMLDivElement>).current = node;
      }
    }
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
        { "is-caution": !!warning },
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
        <p className="p-form-validation__message">
          <span>{error}</span>
        </p>
      )}
      {warning && (
        <p className="p-form-validation__message">
          <span>{warning}</span>
        </p>
      )}
    </div>
  );
};

export default MultiSelectField;
