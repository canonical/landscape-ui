import classNames from "classnames";
import type { FC, MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { useState } from "react";
import { Button } from "@canonical/react-components";
import classes from "./TruncatedCell.module.scss";

interface TruncatedCellProps {
  readonly content: ReactNode;
  readonly isExpanded: boolean;
  readonly onExpand: (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

const TruncatedCell: FC<TruncatedCellProps> = ({
  content,
  isExpanded,
  onExpand,
}) => {
  const [isExpandable, setIsExpandable] = useState(false);

  const expandabilityCheck = (instance: HTMLSpanElement | null) => {
    if (!instance) {
      return;
    }

    if (instance.clientHeight > 24) {
      setIsExpandable(true);
    }
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
            [classes.truncated]: isExpandable && !isExpanded,
          })}
        >
          {content}
        </span>
        {isExpandable && !isExpanded && (
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
              show more
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TruncatedCell;
