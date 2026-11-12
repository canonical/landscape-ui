import classNames from "classnames";
import { useId, useRef, useState, type FC, type ReactNode } from "react";
import classes from "./InteractiveTooltip.module.scss";

export type InteractiveTooltipPosition =
  | "btm-left"
  | "btm-center"
  | "btm-right"
  | "top-left"
  | "top-center"
  | "top-right"
  | "left"
  | "right";

const POSITION_CLASS_MAP: Record<
  InteractiveTooltipPosition,
  string | undefined
> = {
  "btm-left": classes.btmLeft,
  "btm-center": classes.btmCenter,
  "btm-right": classes.btmRight,
  "top-left": classes.topLeft,
  "top-center": classes.topCenter,
  "top-right": classes.topRight,
  left: classes.left,
  right: classes.right,
};

interface InteractiveTooltipProps {
  /** Accessible name of the trigger button. */
  readonly label: string;
  /** Tooltip content. May contain links and other focusable elements. */
  readonly message: ReactNode;
  /** Visual content of the trigger button, usually an icon. */
  readonly children: ReactNode;
  readonly position?: InteractiveTooltipPosition;
  readonly className?: string;
  readonly triggerClassName?: string;
  readonly tooltipClassName?: string;
}

/**
 * A tooltip whose message can hold interactive content such as links.
 *
 * Unlike the portalled `Tooltip`, the message is rendered inline next to its
 * trigger instead of in a portal, so keyboard users can Tab from the trigger
 * straight into the message. Portalling to `document.body` places the popup
 * after every other focusable element on the page and closes it before focus
 * can reach it.
 *
 * The message carries no `tooltip` role: the ARIA tooltip pattern is for
 * non-interactive supplemental text, so a focusable link inside one may be
 * flattened or ignored by assistive technology. The trigger exposes the
 * message as a disclosure instead, styled on Pragma's `contrasted` surface.
 *
 * Prefer `Tooltip` from `@/components/ui` for plain non-interactive messages.
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
      className={classNames(classes.tooltip, className)}
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
        if (event.key !== "Escape" || !isOpen) {
          return;
        }

        // Dismissing the tooltip must not reach document-level Escape
        // listeners, such as the one in useExpandableRow that collapses
        // expanded table rows.
        event.stopPropagation();

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
        aria-expanded={isOpen}
        aria-controls={isOpen ? messageId : undefined}
      >
        {children}
      </button>
      {isOpen && (
        <span
          id={messageId}
          className={classNames(
            "contrasted",
            classes.message,
            POSITION_CLASS_MAP[position],
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
