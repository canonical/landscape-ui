import { Button, Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useState } from "react";
import { splitStatuses } from "./helpers";
import classes from "./InstanceStatus.module.scss";
import type { StatusItem } from "./types";

const StatusPill: FC<{ readonly status: StatusItem }> = ({ status }) => {
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

  return (
    <span className={classNames(classes.pill, classes[status.severity])}>
      <Icon name={status.icon} className={classes.pillIcon} />
      <span
        ref={labelRef}
        className={classes.pillLabel}
        title={isTruncated ? status.label : undefined}
      >
        {status.label}
      </span>
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
}

const StatusPills: FC<StatusPillsProps> = ({
  statuses,
  expandable,
  isExpanded,
  onExpand,
}) => {
  if (!expandable) {
    return (
      <div className={classes.list}>
        {statuses.map((status) => (
          <StatusPill key={status.key} status={status} />
        ))}
      </div>
    );
  }

  const { visible, hidden } = splitStatuses(statuses);

  return (
    <div className={classNames({ [classes.container]: isExpanded })}>
      <div className={isExpanded ? classes.expanded : classes.collapsed}>
        {(isExpanded ? statuses : visible).map((status) => (
          <StatusPill key={status.key} status={status} />
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
            aria-label={`Show ${hidden.length} more ${1 === hidden.length ? "status" : "statuses"}`}
          >
            <span className="u-text--muted">+{hidden.length}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default StatusPills;
