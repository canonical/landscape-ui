import classes from "./ResponsiveDropdownItem.module.scss";
import type { FC, JSXElementConstructor, ReactElement, ReactNode } from "react";
import React, { cloneElement, isValidElement, useRef } from "react";
import { useBoolean, useOnClickOutside } from "usehooks-ts";
import { Button, Icon, type Position } from "@canonical/react-components";
import type { FilterProps } from "@/components/filter/types";
import classNames from "classnames";

interface ResponsiveDropdownItemProps {
  readonly el:
    | ReactElement<FilterProps, JSXElementConstructor<{ name: string }>>
    | ReactNode;
  readonly label?: ReactNode;
  readonly disabled?: boolean;
  readonly onMenuClose?: () => void;
  readonly className?: string;
  readonly position?: Position;
}

const ResponsiveDropdownItem: FC<ResponsiveDropdownItemProps> = ({
  el,
  label,
  disabled = false,
  onMenuClose,
  className,
  position = "left",
}) => {
  const { value: isOpen, setFalse: close, toggle } = useBoolean();
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, close);

  const displayLabel: ReactNode =
    label ||
    (isValidElement(el) &&
    typeof el.props === "object" &&
    el.props !== null &&
    "label" in el.props
      ? (el.props as { label: ReactNode }).label
      : null);

  const content =
    isValidElement(el) &&
    typeof el.props === "object" &&
    el.props !== null &&
    el.type !== React.Fragment
      ? cloneElement(el, { inline: true } as Partial<typeof el.props>)
      : el;

  const alignmentClassMap: Record<Position, string | undefined> = {
    left: classes.alignLeft,
    center: undefined,
    right: classes.alignRight,
  };
  const alignmentClass = alignmentClassMap[position];

  return (
    <div
      ref={ref}
      className={classNames(classes.root, alignmentClass, className)}
    >
      <Button
        type="button"
        appearance="base"
        className={classNames(classes.label, { [classes.isOpen]: isOpen })}
        onClick={toggle}
        disabled={disabled}
      >
        <span className={classes.text}>{displayLabel}</span>
        <Icon name="chevron-down" className={classes.icon} />
      </Button>
      {isOpen && (
        <div
          className={classNames(classes.content, "p-contextual-menu__dropdown")}
          onClick={() => {
            if (onMenuClose) {
              onMenuClose();
            }
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default ResponsiveDropdownItem;
