import classNames from "classnames";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FC,
  type ReactNode,
} from "react";
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

const getDetachedAnchorStyle = (
  position: TooltipPosition,
  element: HTMLElement,
): CSSProperties => {
  const { left: x, top: y, width, height } = element.getBoundingClientRect();
  let left = x;
  let top = y;

  switch (position) {
    case "btm-center":
      left += width / 2;
      top += height;
      break;
    case "btm-left":
      top += height;
      break;
    case "btm-right":
      left += width;
      top += height;
      break;
    case "left":
      top += height / 2;
      break;
    case "right":
      left += width;
      top += height / 2;
      break;
    case "top-center":
      left += width / 2;
      break;
    case "top-left":
      break;
    case "top-right":
      left += width;
      break;
  }

  return { position: "fixed", left, top };
};

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
 * can reach it. Using `position: fixed` on the inline detached anchor still
 * lets the popup escape `overflow: auto` scroll containers such as tables.
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
  const [anchorStyle, setAnchorStyle] = useState<CSSProperties>();
  const messageId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  const updateAnchorPosition = useCallback(() => {
    if (wrapperRef.current) {
      setAnchorStyle(getDetachedAnchorStyle(position, wrapperRef.current));
    }
  }, [position]);

  const openTooltip = useCallback(() => {
    updateAnchorPosition();
    setIsOpen(true);
  }, [updateAnchorPosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    window.addEventListener("scroll", updateAnchorPosition, true);
    window.addEventListener("resize", updateAnchorPosition);

    return () => {
      window.removeEventListener("scroll", updateAnchorPosition, true);
      window.removeEventListener("resize", updateAnchorPosition);
    };
  }, [isOpen, updateAnchorPosition]);

  return (
    <span
      ref={wrapperRef}
      className={classNames(classes.tooltip, className)}
      onMouseEnter={openTooltip}
      onMouseLeave={(event) => {
        if (event.currentTarget.contains(document.activeElement)) {
          return;
        }

        setIsOpen(false);
      }}
      onFocus={openTooltip}
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
              if (isOpen) {
                setIsOpen(false);
              } else {
                openTooltip();
              }
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
          className={classNames(
            // Bottom-left is Vanilla's default and has no modifier class.
            position === "btm-left" ? "p-tooltip" : `p-tooltip--${position}`,
            "is-detached",
            classes.detachedAnchor,
          )}
          style={anchorStyle}
        >
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
        </span>
      )}
    </span>
  );
};

export default InteractiveTooltip;
