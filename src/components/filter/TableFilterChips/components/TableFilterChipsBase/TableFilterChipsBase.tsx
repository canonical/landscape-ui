import { Button, Chip, Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBoolean } from "usehooks-ts";
import classes from "./TableFilterChipsBase.module.scss";

interface FilterBase {
  label: string;
  clear: () => void;
  multiple?: boolean;
}

interface SingleFilter extends FilterBase {
  item: string | undefined;
  multiple?: false;
}

interface MultiFilter extends FilterBase {
  remove: (value: string) => void;
  items: {
    label: string;
    value: string;
  }[];
  multiple: true;
}

type Filter = SingleFilter | MultiFilter;

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

  const calculateOverflowingChips = useCallback(() => {
    if (containerRef.current) {
      const chips = [
        ...containerRef.current.querySelectorAll<HTMLSpanElement>(".p-chip"),
      ];

      if (!chips[0]) {
        collapse();
        setHiddenChipCount(0);
        return;
      }

      const top = chips[0].offsetTop;

      const hiddenChipsLength = chips.filter(
        ({ offsetTop }) => offsetTop > top,
      ).length;

      if (hiddenChipsLength === 0) {
        collapse();
      }

      setHiddenChipCount(hiddenChipsLength);
    }
  }, [collapse]);

  const flatFilters: SingleFilter[] = filters
    .flatMap((filter) => {
      if (!filter.multiple) {
        return filter;
      }

      return filter.items.map<SingleFilter>((item) => {
        return {
          item: item.label,
          label: filter.label,
          clear: () => {
            filter.remove(item.value);
          },
        };
      });
    })
    .filter((filter) => filter.item);

  const hasMultipleChips = flatFilters.length > 1;

  useEffect(() => {
    if (hasMultipleChips) {
      window.addEventListener("resize", calculateOverflowingChips);

      return () => {
        window.removeEventListener("resize", calculateOverflowingChips);
      };
    }
  }, [hasMultipleChips, calculateOverflowingChips]);

  useEffect(() => {
    if (flatFilters.length > 1) {
      calculateOverflowingChips();
    }
  }, [flatFilters, calculateOverflowingChips]);

  if (!flatFilters[0]) {
    return null;
  }

  if (!hasMultipleChips) {
    return (
      <div className={classes.container}>
        <Chip
          value={`${flatFilters[0].label}: ${flatFilters[0].item}`}
          onDismiss={flatFilters[0].clear}
          className="u-no-margin--bottom u-no-margin--right"
        />
      </div>
    );
  }

  const clearAllAndCollapse = () => {
    clearAll();
    collapse();
  };

  return (
    <div className={classes.container}>
      <div
        ref={containerRef}
        className={classNames(classes.chipsContainer, {
          [classes.collapsed]: !isExpanded,
        })}
      >
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

        {flatFilters.map((filter) => {
          return (
            <Chip
              key={`${filter.label}-${filter.item}`}
              value={`${filter.label}: ${filter.item}`}
              onDismiss={filter.clear}
              className="u-no-margin--bottom u-no-margin--right"
            />
          );
        })}

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
