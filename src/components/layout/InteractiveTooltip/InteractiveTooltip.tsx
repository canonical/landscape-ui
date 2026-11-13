import classNames from "classnames";
import { useId, useRef, useState, type FC, type ReactNode } from "react";
import classes from "./InteractiveTooltip.module.scss";

/* TODO: Migrate `InteractiveTooltip` (and its Vanilla `p-tooltip` /
   `p-tooltip__message` classes below) to Pragma `Popover` once `Popover` is
   stabilized upstream (`ds:global.component.popover` is currently in
   `needsdefinition` / `_work_in_progress`). */
type TooltipPosition =
  | "btm-center"
  | "btm-left"
  | "btm-right"
  | "left"
  | "right"
  | "top-center"
  | "top-left"
  | "top-right";

interface InteractiveTooltipProps {
  /** Accessible name of the trigger. */
  readonly label: string;
  /** Tooltip content. May contain links and other focusable elements. */
  readonly message: ReactNode;
  /** Visual content of the trigger, usually an icon or disabled control. */
  readonly children: ReactNode;
  readonly position?: TooltipPosition;
  /** Element used for the focusable trigger. Use `"span"` when wrapping form controls that cannot sit inside a `<button>`. */
  readonly triggerElement?: "button" | "span";
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
 * message as a disclosure instead.
 *
 * Prefer `Tooltip` from `@/components/ui` for plain text messages.
 */
const InteractiveTooltip: FC<InteractiveTooltipProps> = ({
  label,
  message,
  children,
  position = "btm-left",
  triggerElement = "button",
  className,
  triggerClassName,
  tooltipClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const messageId = useId();
  const triggerRef = useRef<HTMLElement>(null);

  return (
    <span
      className={classNames(
        // Bottom-left is Vanilla's default and has no modifier class.
        position === "btm-left"
          ? "p-tooltip"
          : `p-tooltip p-tooltip--${position}`,
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
      {triggerElement === "span" ? (
        <span
          role="button"
          tabIndex={0}
          ref={triggerRef}
          className={triggerClassName}
          aria-label={label}
          aria-expanded={isOpen}
          aria-controls={isOpen ? messageId : undefined}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              setIsOpen((prev) => !prev);
            }
          }}
        >
          {children}
        </span>
      ) : (
        <button
          type="button"
          ref={(node) => {
            triggerRef.current = node;
          }}
          className={classNames(classes.trigger, triggerClassName)}
          aria-label={label}
          aria-expanded={isOpen}
          aria-controls={isOpen ? messageId : undefined}
        >
          {children}
        </button>
      )}
      {isOpen && (
        <span
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
