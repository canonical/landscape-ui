import { Button } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLSpanElement | null>(null);

  const expandabilityCheck = (): void => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    setOverflownChildCount(
      [...container.childNodes].filter((child) => {
        const range = document.createRange();
        range.selectNodeContents(child);

        return (
          range.getBoundingClientRect().right >
          container.getBoundingClientRect().right
        );
      }).length,
    );
  };

  useEffect(() => {
    window.addEventListener("resize", expandabilityCheck);

    return (): void => {
      window.removeEventListener("resize", expandabilityCheck);
    };
  }, []);

  return (
    <div className={classNames({ [classes.container]: isExpanded })}>
      <div className={isExpanded ? classes.expanded : classes.collapsed}>
        <span
          ref={containerRef}
          className={isExpanded ? classes.expandedContent : classes.truncated}
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
