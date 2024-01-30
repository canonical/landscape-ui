import { FC, useEffect, useRef, useState } from "react";
import { Button } from "@canonical/react-components";
import classes from "./OverflowingCell.module.scss";

interface OverflowingCellProps {
  items: string[];
}

const OverflowingCell: FC<OverflowingCellProps> = ({ items }) => {
  const [overflowingItemsAmount, setOverflowingItemsAmount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const overflowingSpansCount = (
    divElement: HTMLDivElement,
    overflowRowLimit = 1,
  ) => {
    const spans = divElement.querySelectorAll("span");

    let count = 0;

    spans.forEach((element) => {
      const span = element as HTMLSpanElement;

      if (span.offsetTop > span.offsetHeight * overflowRowLimit) {
        count++;
      }
    });

    setOverflowingItemsAmount(count);
  };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    document.addEventListener("resize", () =>
      overflowingSpansCount(containerRef.current as HTMLDivElement),
    );

    overflowingSpansCount(containerRef.current as HTMLDivElement);

    return () => {
      document.removeEventListener("resize", () =>
        overflowingSpansCount(containerRef.current as HTMLDivElement),
      );
    };
  }, [containerRef.current]);

  return (
    <div className={classes.container}>
      <div ref={containerRef} className={classes.truncated}>
        {items.map((item) => (
          <span className={classes.item} key={item}>
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top"
            >
              {item}
            </Button>
          </span>
        ))}
      </div>
      {overflowingItemsAmount > 0 && (
        <span className={classes.count}>
          <span className="u-text--muted">... +</span>
          <span className="u-text--muted">{overflowingItemsAmount}</span>
        </span>
      )}
    </div>
  );
};

export default OverflowingCell;
