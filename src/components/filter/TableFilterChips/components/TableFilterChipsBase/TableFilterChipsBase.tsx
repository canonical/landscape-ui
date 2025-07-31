import { Button, Chip, Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { useBoolean } from "usehooks-ts";
import classes from "./TableFilterChipsBase.module.scss";

interface FilterBase {
  label: string;
  clear: () => void;
  multiple?: boolean;
}

interface SingleFilter<T> extends FilterBase {
  item: T | undefined;
  multiple?: false;
}

interface MultiFilter<T> extends FilterBase {
  remove: (value: T) => void;
  items: {
    label: string;
    value: T;
  }[];
  multiple: true;
}

type Filter<T = unknown> = SingleFilter<T> | MultiFilter<T>;

interface TableFilterChipsProps {
  readonly filters: Filter[];
  readonly clearAll?: () => void;
}

const TableFilterChipsBase: FC<TableFilterChipsProps> = ({
  filters,
  clearAll = () => {
    for (const filter of filters) {
      filter.clear();
    }
  },
}) => {
  const {
    value: isExpanded,
    setTrue: expand,
    setFalse: collapse,
  } = useBoolean();
  const [hiddenChipCount, setHiddenChipCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const clearAllAndCollapse = () => {
    clearAll();
    collapse();
  };

  const calculateOverflowingChips = () => {
    if (!containerRef.current) {
      return;
    }

    const chips = [
      ...containerRef.current.querySelectorAll<HTMLSpanElement>(".p-chip"),
    ];

    if (!chips.length) {
      setHiddenChipCount(0);
      return;
    }

    const top = chips[0].offsetTop;

    const hiddenChipsLength = chips.filter(
      ({ offsetTop }) => offsetTop > top,
    ).length;

    if (hiddenChipsLength === 0) {
      collapse();
      setHiddenChipCount(0);
    }

    setHiddenChipCount(hiddenChipsLength);
  };

  useEffect(() => {
    window.addEventListener("resize", calculateOverflowingChips);

    return () => {
      window.removeEventListener("resize", calculateOverflowingChips);
    };
  }, []);

  useEffect(() => {
    calculateOverflowingChips();
  }, [
    hiddenChipCount,
    ...filters.map((filter) =>
      filter.multiple ? filter.items.length : filter.item,
    ),
  ]);

  const totalChipsToRenderCount = filters.reduce(
    (previousValue, filter) =>
      previousValue +
      (filter.multiple ? filter.items.length : Number(!!filter.item)),
    0,
  );

  if (!totalChipsToRenderCount) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div
        ref={containerRef}
        className={classNames(classes.chipsContainer, {
          [classes.collapsed]: !isExpanded,
        })}
      >
        {totalChipsToRenderCount > 1 && (
          <Button
            type="button"
            appearance="link"
            hasIcon
            className={classes.clearAllButton}
            onClick={clearAllAndCollapse}
          >
            <Icon name="close" className={classes.clearAllIcon} />
            <span>Clear all filters</span>
          </Button>
        )}

        {filters.map((filter) =>
          filter.multiple
            ? filter.items.map(
                (item, index) =>
                  !!item.label && (
                    <Chip
                      key={filter.label + index}
                      value={`${filter.label}: ${item.label}`}
                      onDismiss={() => {
                        filter.remove(item.value);
                      }}
                      className="u-no-margin--bottom u-no-margin--right"
                    />
                  ),
              )
            : !!filter.item && (
                <Chip
                  key={filter.label}
                  value={`${filter.label}: ${filter.item}`}
                  onDismiss={filter.clear}
                  className="u-no-margin--bottom u-no-margin--right"
                />
              ),
        )}

        {isExpanded && (
          <Button
            type="button"
            appearance="link"
            className={classes.showLessButton}
            onClick={collapse}
          >
            <span className="u-text--muted">Show less</span>
          </Button>
        )}
      </div>

      {!!hiddenChipCount && !isExpanded && (
        <Button
          type="button"
          appearance="link"
          className={classes.showMoreButton}
          onClick={expand}
        >
          <span className="u-text--muted">{`+${hiddenChipCount}`}</span>
        </Button>
      )}
    </div>
  );
};

export default TableFilterChipsBase;
