import type { TooltipProps } from "@canonical/react-components";
import classNames from "classnames";
import { useId, useRef, useState, type FC, type ReactNode } from "react";
import classes from "./InteractiveTooltip.module.scss";

type TooltipPosition = NonNullable<TooltipProps["position"]>;

interface InteractiveTooltipProps {
  /** Accessible name of the trigger button. */
  readonly label: string;
  /** Tooltip content. May contain links and other focusable elements. */
  readonly message: ReactNode;
  /** Visual content of the trigger button, usually an icon. */
  readonly children: ReactNode;
  readonly position?: TooltipPosition;
  readonly className?: string;
  readonly triggerClassName?: string;
  readonly tooltipClassName?: string;
}

/**
 * A tooltip whose message can hold interactive content such as links.
 *
 * Unlike the Vanilla `Tooltip`, the message is rendered inline next to its
 * trigger instead of in a portal, so keyboard users can Tab from the trigger
 * straight into the message. The Vanilla component appends its message to the
 * end of the document, which places it after every other focusable element on
 * the page and closes the tooltip before focus can reach it.
 *
 * Prefer the Vanilla `Tooltip` for plain text messages.
 */
const InteractiveTooltip: FC<InteractiveTooltipProps> = ({
  label,
  message,
  children,
  position = "btm-left",
  className,
  triggerClassName,
  tooltipClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const messageId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <span
      className={classNames(
        // Bottom-left is Vanilla's default and has no modifier class.
        position === "btm-left" ? "p-tooltip" : `p-tooltip--${position}`,
        classes.tooltip,
        className,
      )}
      onMouseEnter={() => {
        setIsOpen(true);
      }}
      onMouseLeave={(event) => {
        if (event.currentTarget.contains(document.activeElement)) {
          return;
        }

        setIsOpen(false);
      }}
      onFocus={() => {
        setIsOpen(true);
      }}
      onBlur={(event) => {
        if (
          event.relatedTarget instanceof Node &&
          event.currentTarget.contains(event.relatedTarget)
        ) {
          return;
        }

        setIsOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") {
          return;
        }

        // Focus first: moving focus back to the trigger fires the wrapper's
        // focus handler, which would otherwise reopen the tooltip.
        triggerRef.current?.focus();
        setIsOpen(false);
      }}
    >
      <button
        type="button"
        ref={triggerRef}
        className={classNames(classes.trigger, triggerClassName)}
        aria-label={label}
        aria-describedby={isOpen ? messageId : undefined}
      >
        {children}
      </button>
      {isOpen && (
        <span
          role="tooltip"
          id={messageId}
          className={classNames(
            "p-tooltip__message",
            classes.message,
            tooltipClassName,
          )}
        >
          {message}
        </span>
      )}
    </span>
  );
};

export default InteractiveTooltip;
