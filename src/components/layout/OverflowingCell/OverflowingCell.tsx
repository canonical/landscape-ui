import classNames from "classnames";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@canonical/react-components";
import classes from "./OverflowingCell.module.scss";

interface OverflowingCellProps {
  items: ReactNode[];
}

const OverflowingCell: FC<OverflowingCellProps> = ({ items }) => {
  const [overflowingItemsAmount, setOverflowingItemsAmount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const overflowingItemsCount = () => {
    if (!containerRef.current) {
      return;
    }

    // eslint-disable-next-line no-undef
    const spans: NodeListOf<HTMLSpanElement> =
      containerRef.current.querySelectorAll(`span.${classes.item}`);

    setOverflowingItemsAmount(
      Array.from(spans).filter(
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
  }, [items]);

  return (
    <div className={classes.container}>
      <div
        ref={containerRef}
        className={classNames(classes.truncated, {
          [classes.hidden]: !isExpanded,
        })}
      >
        {items.map((item, index) => (
          <span key={index} className={classes.item}>
            {item}
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
