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
  const cellRef = useRef<HTMLDivElement | null>(null);
  const contentSpanRef = useRef<HTMLSpanElement | null>(null);

  const expandabilityCheck = (): void => {
    const cell = cellRef.current;
    const contentSpan = contentSpanRef.current;

    if (!cell || !contentSpan) {
      return;
    }

    setOverflownChildCount(
      [...contentSpan.childNodes].filter((child) => {
        const range = document.createRange();
        range.selectNodeContents(child);

        return (
          range.getBoundingClientRect().right >
          cell.getBoundingClientRect().right
        );
      }).length,
    );
  };

  useEffect(() => {
    expandabilityCheck();

    if (!cellRef.current) {
      return;
    }

    const observer = new ResizeObserver(() => {
      expandabilityCheck();
    });

    observer.observe(cellRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={classNames({ [classes.container]: isExpanded })}>
      <div
        ref={cellRef}
        className={isExpanded ? classes.expanded : classes.collapsed}
      >
        <span
          ref={contentSpanRef}
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
              {showCount ? `+${overflownChildCount}` : "Show more"}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TruncatedCell;
