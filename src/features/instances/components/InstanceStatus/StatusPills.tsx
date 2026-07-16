import { Button, Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useState } from "react";
import { splitStatuses } from "./helpers";
import classes from "./InstanceStatus.module.scss";
import type { StatusItem } from "./types";

interface StatusPillProps {
  readonly status: StatusItem;
  /** When provided the pill becomes an interactive button (e.g. tag filters). */
  readonly onClick?: (status: StatusItem) => void;
}

export const StatusPill: FC<StatusPillProps> = ({ status, onClick }) => {
  const [isTruncated, setIsTruncated] = useState(false);

  // A tooltip is only useful when the label is actually clipped, so the label
  // is measured and re-measured as the surrounding cell resizes. The full text
  // is exposed via the native `title` attribute, which (unlike wrapping in a
  // Tooltip) doesn't alter layout and so can't feed back into the measurement.
  const labelRef = useCallback((element: HTMLSpanElement | null) => {
    if (!element) {
      return;
    }

    const checkTruncation = () => {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    };

    checkTruncation();

    const observer = new ResizeObserver(checkTruncation);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const inner = (
    <>
      {status.icon && <Icon name={status.icon} className={classes.pillIcon} />}
      <span
        ref={labelRef}
        className={classes.pillLabel}
        title={isTruncated ? status.label : undefined}
      >
        {status.label}
      </span>
    </>
  );

  // Only pills that map to a filter become interactive: the rest stay as plain,
  // non-clickable chips so they don't advertise an action that does nothing.
  if (onClick && status.filterValue) {
    return (
      <button
        type="button"
        className={classNames(
          classes.pill,
          classes[status.severity],
          classes.clickable,
        )}
        onClick={() => {
          onClick(status);
        }}
      >
        {inner}
      </button>
    );
  }

  return (
    <span className={classNames(classes.pill, classes[status.severity])}>
      {inner}
    </span>
  );
};

interface StatusPillsProps {
  readonly statuses: StatusItem[];
  /**
   * Renders a compact, expandable variant for table cells: red statuses stay
   * visible while the rest collapse behind a counter. When omitted, every
   * status is shown.
   */
  readonly expandable?: boolean;
  readonly isExpanded?: boolean;
  readonly onExpand?: (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  /** When provided each pill becomes clickable, e.g. to filter by a tag. */
  readonly onStatusClick?: (status: StatusItem) => void;
  /**
   * The noun announced by the expander, e.g. "Show 2 more statuses". Defaults to
   * status wording; Tags pass tag wording since they reuse this component.
   */
  readonly itemNoun?: { singular: string; plural: string };
}

const StatusPills: FC<StatusPillsProps> = ({
  statuses,
  expandable,
  isExpanded,
  onExpand,
  onStatusClick,
  itemNoun = { singular: "status", plural: "statuses" },
}) => {
  if (!expandable) {
    return (
      <div className={classes.list}>
        {statuses.map((status) => (
          <StatusPill
            key={status.key}
            status={status}
            onClick={onStatusClick}
          />
        ))}
      </div>
    );
  }

  const { visible, hidden } = splitStatuses(statuses);

  return (
    <div className={classNames({ [classes.container]: isExpanded })}>
      <div className={isExpanded ? classes.expanded : classes.collapsed}>
        {(isExpanded ? statuses : visible).map((status) => (
          <StatusPill
            key={status.key}
            status={status}
            onClick={onStatusClick}
          />
        ))}

        {!isExpanded && hidden.length > 0 && (
          <Button
            type="button"
            appearance="link"
            className={classNames(
              "p-text--small u-no-margin--bottom",
              classes.button,
            )}
            onClick={onExpand}
            aria-label={`Show ${hidden.length} more ${1 === hidden.length ? itemNoun.singular : itemNoun.plural}`}
          >
            <span className="u-text--muted">+{hidden.length}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default StatusPills;
