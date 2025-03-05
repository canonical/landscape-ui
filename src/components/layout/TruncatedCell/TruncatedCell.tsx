import { Button } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { useState } from "react";
import classes from "./TruncatedCell.module.scss";

interface TruncatedCellProps {
  readonly content: ReactNode;
  readonly isExpanded: boolean;
  readonly onExpand: (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  readonly showCount?: boolean;
}

const TruncatedCell: FC<TruncatedCellProps> = ({
  content,
  isExpanded,
  onExpand,
  showCount,
}) => {
  const [overflownChildCount, setOverflownChildCount] = useState<
    number | undefined
  >(undefined);

  const expandabilityCheck = (instance: HTMLSpanElement | null): void => {
    if (!instance) {
      return;
    }

    const overflownChildCount = [...instance.children].filter(
      (child) =>
        child.getBoundingClientRect().right >
        instance.getBoundingClientRect().right,
    ).length;

    setOverflownChildCount(overflownChildCount);
  };

  return (
    <div className={classNames({ [classes.container]: isExpanded })}>
      <div
        className={classNames(
          isExpanded ? classes.expanded : classes.collapsed,
        )}
      >
        <span
          ref={expandabilityCheck}
          className={classNames({
            [classes.expandedContent]: isExpanded,
            [classes.truncated]: !isExpanded,
          })}
        >
          {content}
        </span>
        {!!overflownChildCount && !isExpanded && (
          <Button
            type="button"
            appearance="link"
            className={classNames(
              "p-text--small u-no-margin--bottom",
              classes.button,
            )}
            onClick={onExpand}
          >
            <span className={classNames("u-text--muted", classes.buttonText)}>
              {showCount ? `+${overflownChildCount}` : "show more"}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TruncatedCell;
