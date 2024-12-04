import { usePageParams } from "@/hooks/usePageParams";
import { SelectOption } from "@/types/SelectOption";
import { Button, Chip, Icon } from "@canonical/react-components";
import classNames from "classnames";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { defaultFiltersToDisplay } from "./constants";
import { getChipLabel, parseSearchToChips } from "./helpers";
import classes from "./TableFilterChips.module.scss";
import { FilterKey } from "./types";

interface TableFilterChipsProps {
  accessGroupOptions?: SelectOption[];
  availabilityZonesOptions?: SelectOption[];
  filtersToDisplay?: FilterKey[];
  osOptions?: SelectOption[];
  statusOptions?: SelectOption[];
  tagOptions?: SelectOption[];
  typeOptions?: SelectOption[];
  useSearchAsQuery?: boolean;
}

const TableFilterChips: FC<TableFilterChipsProps> = ({
  accessGroupOptions,
  availabilityZonesOptions,
  filtersToDisplay,
  osOptions,
  statusOptions,
  tagOptions,
  typeOptions,
  useSearchAsQuery = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hiddenChipCount, setHiddenChipCount] = useState(0);

  const filtersToMonitor = filtersToDisplay ?? defaultFiltersToDisplay;

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    setPageParams,
    accessGroups,
    availabilityZones,
    fromDate,
    os,
    status,
    tags,
    toDate,
    type,
    search,
  } = usePageParams();

  const handleClearAllFilters = () => {
    setPageParams({
      accessGroups: [],
      availabilityZones: [],
      fromDate: "",
      os: "",
      status: "",
      tags: [],
      toDate: "",
      type: "",
      search: "",
    });
    setIsExpanded(false);
  };

  const calculateOverflowingChips = () => {
    if (!containerRef.current) {
      return;
    }

    const chips = [
      ...containerRef.current.querySelectorAll<HTMLSpanElement>(".p-chip"),
    ];

    if (!chips.length) {
      return setHiddenChipCount(0);
    }

    const top = chips[0].offsetTop;

    const hiddenChipsLength = chips.filter(
      ({ offsetTop }) => offsetTop > top,
    ).length;

    if (hiddenChipsLength === 0) {
      setIsExpanded(false);
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
    accessGroups.length,
    availabilityZones.length,
    fromDate,
    hiddenChipCount,
    os,
    status,
    tags.length,
    toDate,
    type,
    search,
  ]);

  const searchChips = useMemo(() => parseSearchToChips(search), [search]);

  const showClearAllButton =
    [
      ...[status].slice(filtersToMonitor.includes("status") ? 0 : 1),
      ...[os].slice(filtersToMonitor.includes("os") ? 0 : 1),
      ...availabilityZones.slice(
        filtersToMonitor.includes("availabilityZones")
          ? 0
          : availabilityZones.length,
      ),
      ...accessGroups.slice(
        filtersToMonitor.includes("accessGroups") ? 0 : accessGroups.length,
      ),
      ...tags.slice(filtersToMonitor.includes("tags") ? 0 : tags.length),
      ...[fromDate].slice(filtersToMonitor.includes("fromDate") ? 0 : 1),
      ...[toDate].slice(filtersToMonitor.includes("toDate") ? 0 : 1),
      ...[type].slice(filtersToMonitor.includes("type") ? 0 : 1),
      ...[search].slice(filtersToMonitor.includes("search") ? 0 : 1),
      useSearchAsQuery && search.includes(",") ? 1 : 0,
    ].filter(Boolean).length > 1;

  return (
    <div className={classes.container}>
      <div
        ref={containerRef}
        className={classNames(classes.chipsContainer, {
          [classes.collapsed]: !isExpanded,
        })}
      >
        {showClearAllButton && (
          <Button
            type="button"
            appearance="link"
            hasIcon
            className={classes.clearAllButton}
            onClick={handleClearAllFilters}
          >
            <Icon name="close" className={classes.clearAllIcon} />
            <span>Clear all filters</span>
          </Button>
        )}
        {filtersToMonitor.includes("search") &&
          useSearchAsQuery &&
          searchChips.map((chip) => (
            <Chip
              key={chip.value}
              value={getChipLabel(chip)}
              onDismiss={() =>
                setPageParams({
                  search: search
                    .split(",")
                    .filter((searchParam) => searchParam !== chip.value)
                    .join(","),
                })
              }
              className="u-no-margin--bottom u-no-margin--right"
            />
          ))}
        {filtersToMonitor.includes("search") && !useSearchAsQuery && search && (
          <Chip
            value={`Search: ${search}`}
            onDismiss={() => setPageParams({ search: "" })}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {filtersToMonitor.includes("status") && status && (
          <Chip
            value={`Status: ${statusOptions?.find(({ value }) => value === status)?.label ?? status}`}
            onDismiss={() => setPageParams({ status: "" })}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {filtersToMonitor.includes("os") && os && (
          <Chip
            value={`OS: ${osOptions?.find(({ value }) => value === os)?.label ?? os}`}
            onDismiss={() => setPageParams({ os: "" })}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {filtersToMonitor.includes("availabilityZones") &&
          availabilityZones.map((availabilityZone, _, array) => (
            <Chip
              key={availabilityZone}
              value={`Availability z.: ${availabilityZonesOptions?.find(({ value }) => value === availabilityZone)?.label ?? availabilityZone}`}
              onDismiss={() =>
                setPageParams({
                  availabilityZones: array.filter(
                    (item) => item !== availabilityZone,
                  ),
                })
              }
              className="u-no-margin--bottom u-no-margin--right"
            />
          ))}
        {filtersToMonitor.includes("accessGroups") &&
          accessGroups.map((accessGroup, _, array) => (
            <Chip
              key={accessGroup}
              value={`Access group: ${accessGroupOptions?.find(({ value }) => value === accessGroup)?.label ?? accessGroup}`}
              onDismiss={() =>
                setPageParams({
                  accessGroups: array.filter((item) => item !== accessGroup),
                })
              }
              className="u-no-margin--bottom u-no-margin--right"
            />
          ))}
        {filtersToMonitor.includes("tags") &&
          tags.map((tag, _, array) => (
            <Chip
              key={tag}
              value={`Tag: ${tagOptions?.find(({ value }) => value === tag)?.label ?? tag}`}
              onDismiss={() =>
                setPageParams({ tags: array.filter((item) => item !== tag) })
              }
              className="u-no-margin--bottom u-no-margin--right"
            />
          ))}
        {filtersToMonitor.includes("fromDate") && fromDate && (
          <Chip
            value={`From: ${fromDate}`}
            onDismiss={() => setPageParams({ fromDate: "" })}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {filtersToMonitor.includes("toDate") && toDate && (
          <Chip
            value={`To: ${toDate}`}
            onDismiss={() => setPageParams({ toDate: "" })}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {filtersToMonitor.includes("type") && type && (
          <Chip
            value={`Type: ${typeOptions?.find(({ value }) => value === type)?.label ?? type}`}
            onDismiss={() => setPageParams({ type: "" })}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {isExpanded && (
          <Button
            type="button"
            appearance="link"
            className={classes.showLessButton}
            onClick={() => setIsExpanded(false)}
          >
            <span className="u-text--muted">Show less</span>
          </Button>
        )}
      </div>
      {hiddenChipCount > 0 && !isExpanded && (
        <Button
          type="button"
          appearance="link"
          className={classes.showMoreButton}
          onClick={() => setIsExpanded(true)}
        >
          <span className="u-text--muted">{`+${hiddenChipCount}`}</span>
        </Button>
      )}
    </div>
  );
};

export default TableFilterChips;
