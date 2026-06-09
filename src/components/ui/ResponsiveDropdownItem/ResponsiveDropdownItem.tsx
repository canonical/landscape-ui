import classes from "./ResponsiveDropdownItem.module.scss";
import type { FC, JSXElementConstructor, ReactElement, ReactNode } from "react";
import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useRef,
  useState,
} from "react";
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

  // The submenu opens to the side dictated by `position`, but a deeply nested
  // or right-aligned menu can run off the viewport edge. We measure it as it
  // mounts (via a callback ref) and flip to the opposite side if it would
  // overflow, so the submenu always stays on screen (Instances/Activities
  // filter menus).
  const [alignment, setAlignment] = useState<Position>(position);

  useOnClickOutside(ref, close);

  const measureContent = useCallback(
    (content: HTMLDivElement | null) => {
      if (!content) {
        return;
      }

      const rect = content.getBoundingClientRect();
      if (position !== "right" && rect.right > window.innerWidth) {
        setAlignment("right");
      } else if (position === "right" && rect.left < 0) {
        setAlignment("left");
      }
    },
    [position],
  );

  const handleToggle = () => {
    // Re-measure from the requested side on each open instead of staying stuck
    // on a previously flipped alignment.
    if (!isOpen) {
      setAlignment(position);
    }
    toggle();
  };

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
  const alignmentClass = alignmentClassMap[alignment];

  const buttonContent =
    alignment === "right" ? (
      <>
        <Icon name="chevron-left" />
        <span className={classes.text}>{displayLabel}</span>
      </>
    ) : (
      <>
        <span className={classes.text}>{displayLabel}</span>
        <Icon name="chevron-right" />
      </>
    );

  return (
    <div
      ref={ref}
      className={classNames(classes.root, alignmentClass, className)}
    >
      <Button
        type="button"
        appearance="base"
        className={classNames(classes.label, { [classes.isOpen]: isOpen })}
        onClick={handleToggle}
        disabled={disabled}
        hasIcon={alignment === "right"}
      >
        {buttonContent}
      </Button>
      {isOpen && (
        <div
          ref={measureContent}
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
