import { FC, useEffect, useRef, useState } from "react";
import { Button } from "@canonical/react-components";
import classes from "./OverflowingCell.module.scss";
import classNames from "classnames";

interface OverflowingCellProps {
  items: string[];
}

const OverflowingCell: FC<OverflowingCellProps> = ({ items }) => {
  const [overflowingItemsAmount, setOverflowingItemsAmount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const overflowingItemsCount = () => {
    if (!containerRef.current) {
      return;
    }

    const buttons = containerRef.current.querySelectorAll(`button`);

    setOverflowingItemsAmount(
      Array.from(buttons).filter(
        ({ offsetHeight, offsetTop }) => offsetTop > offsetHeight,
      ).length,
    );
  };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    window.addEventListener("resize", overflowingItemsCount);

    return () => {
      window.removeEventListener("resize", overflowingItemsCount);
    };
  }, [containerRef.current]);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    window.removeEventListener("resize", overflowingItemsCount);
  }, [isExpanded]);

  useEffect(() => {
    overflowingItemsCount();
  }, [items, overflowingItemsAmount]);

  return (
    <div className={classes.container}>
      <div
        ref={containerRef}
        className={classNames(classes.truncated, {
          [classes.hidden]: !isExpanded,
        })}
      >
        {items.map((item, index) => (
          <span className={classes.item} key={item}>
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top"
            >
              {item}
            </Button>
            {index < items.length - 1 && <span>, </span>}
          </span>
        ))}
      </div>
      {overflowingItemsAmount > 0 && !isExpanded && (
        <Button
          type="button"
          appearance="base"
          onClick={() => {
            setIsExpanded(true);
          }}
          className={classNames(
            "u-no-margin--bottom u-no-padding",
            classes.count,
          )}
        >
          <span className="u-text--muted"> +</span>
          <span className="u-text--muted">{overflowingItemsAmount}</span>
        </Button>
      )}
    </div>
  );
};

export default OverflowingCell;
