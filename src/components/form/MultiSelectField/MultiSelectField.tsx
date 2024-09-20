import { FC, MutableRefObject, Ref, useEffect, useRef, useState } from "react";
import { MultiSelect, MultiSelectProps } from "@canonical/react-components";
import classNames from "classnames";
import classes from "./MultiSelectField.module.scss";

interface MultiSelectFieldProps extends MultiSelectProps {
  className?: string;
  innerRef?: Ref<HTMLDivElement>;
  label?: string;
  labelClassName?: string;
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
  const [isExpanded, setIsExpanded] = useState(false);

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
        (innerRef as MutableRefObject<HTMLDivElement>).current = node;
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
      controlRef as MutableRefObject<
        HTMLButtonElement | HTMLInputElement | null
      >
    ).current = button || input;

    dropdownIdRef.current =
      controlRef.current?.getAttribute("aria-controls") || "";
  };

  useEffect(() => {
    if (!controlRef.current) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      if (
        mutations.some(
          ({ attributeName, type }) =>
            type === "attributes" && attributeName === "aria-expanded",
        )
      ) {
        setIsExpanded((prevState) => !prevState);
      }
    });

    observer.observe(controlRef.current, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isExpanded || !dropdownIdRef.current) {
      return;
    }

    const dropdown = document.getElementById(dropdownIdRef.current);

    const portal = dropdown?.closest<HTMLSpanElement>(".multi-select");

    if (!portal) {
      return;
    }

    portal.style.zIndex = "101";
  }, [isExpanded]);

  const footer = error ? (
    <div>
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
      <MultiSelect
        label={label}
        error={error}
        dropdownFooter={footer}
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
