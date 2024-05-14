import classNames from "classnames";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@canonical/react-components";
import classes from "./OverflowingCell.module.scss";
const STRING_TUNCATION_LIMIT = 120;

interface OverflowingCellProps {
  items: ReactNode[];
}

const OverflowingCell: FC<OverflowingCellProps> = ({ items }) => {
  const [overflowingItemsAmount, setOverflowingItemsAmount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const isSingleStringItem = items.length === 1 && typeof items[0] === "string";
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
    if (containerRef.current) {
      setIsOverflowing(
        containerRef.current.scrollHeight > containerRef.current.clientHeight,
      );
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
          [classes.expandedString]: isSingleStringItem && isExpanded,
          [classes.showScroll]: isOverflowing,
        })}
      >
        {isSingleStringItem ? (
          <>
            {(items[0] as string).slice(0, STRING_TUNCATION_LIMIT)}
            <span
              className={classNames({
                [classes.hidden]: !isExpanded,
              })}
            >
              {(items[0] as string).slice(STRING_TUNCATION_LIMIT)}
            </span>
          </>
        ) : (
          items.map((item, index) => (
            <span key={index} className={classes.item}>
              {item}
            </span>
          ))
        )}
      </div>
      {(overflowingItemsAmount > 0 ||
        (isSingleStringItem &&
          (items[0] as string).length > STRING_TUNCATION_LIMIT)) &&
        !isExpanded && (
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
            {isSingleStringItem ? (
              <span className="p-text--small u-text--muted">show more</span>
            ) : (
              <>
                <span className="u-text--muted"> +</span>
                <span className="u-text--muted">{overflowingItemsAmount}</span>
              </>
            )}
          </Button>
        )}
    </div>
  );
};

export default OverflowingCell;
