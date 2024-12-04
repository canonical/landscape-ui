import { usePageParams } from "@/hooks/usePageParams";
import { SelectOption } from "@/types/SelectOption";
import { Button, Chip, Icon } from "@canonical/react-components";
import classNames from "classnames";
import { FC, useEffect, useRef, useState } from "react";
import { defaultFiltersToDisplay } from "./constants";
import {
  checkRenderConditions,
  filterSearch,
  getChipLabel,
  parseSearch,
} from "./helpers";
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

  const renderResults = checkRenderConditions({
    accessGroups,
    availabilityZones,
    filtersToMonitor,
    fromDate,
    os,
    search,
    status,
    tags,
    toDate,
    type,
    useSearchAsQuery,
  });

  if (renderResults.totalChipsToRenderCount === 0) {
    return null;
  }

  return (
    <div className={classes.container} data-testId="table-filter-chips">
      <div
        ref={containerRef}
        className={classNames(classes.chipsContainer, {
          [classes.collapsed]: !isExpanded,
        })}
      >
        {renderResults.totalChipsToRenderCount > 1 && (
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
        {renderResults.areSearchQueryChipsRender &&
          parseSearch(search).map((value) => (
            <Chip
              key={value}
              value={`Search: ${value}`}
              onDismiss={() =>
                setPageParams({ search: filterSearch(search, value) })
              }
              className="u-no-margin--bottom u-no-margin--right"
            />
          ))}
        {renderResults.isSearchChipRender && (
          <Chip
            value={`Search: ${search}`}
            onDismiss={() => setPageParams({ search: "" })}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {renderResults.isStatusChipRender && (
          <Chip
            value={`Status: ${getChipLabel(statusOptions, status)}`}
            onDismiss={() => setPageParams({ status: "" })}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {renderResults.isOsChipRender && (
          <Chip
            value={`OS: ${getChipLabel(osOptions, os)}`}
            onDismiss={() => setPageParams({ os: "" })}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {renderResults.areAvailabilityZonesChipsRender &&
          availabilityZones.map((availabilityZone, _, array) => (
            <Chip
              key={availabilityZone}
              value={`Availability z.: ${getChipLabel(availabilityZonesOptions, availabilityZone)}`}
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
        {renderResults.areAccessGroupsChipsRender &&
          accessGroups.map((accessGroup, _, array) => (
            <Chip
              key={accessGroup}
              value={`Access group: ${getChipLabel(accessGroupOptions, accessGroup)}`}
              onDismiss={() =>
                setPageParams({
                  accessGroups: array.filter((item) => item !== accessGroup),
                })
              }
              className="u-no-margin--bottom u-no-margin--right"
            />
          ))}
        {renderResults.areTagsChipsRender &&
          tags.map((tag, _, array) => (
            <Chip
              key={tag}
              value={`Tag: ${getChipLabel(tagOptions, tag)}`}
              onDismiss={() =>
                setPageParams({ tags: array.filter((item) => item !== tag) })
              }
              className="u-no-margin--bottom u-no-margin--right"
            />
          ))}
        {renderResults.isFromDateChipRender && (
          <Chip
            value={`From: ${fromDate}`}
            onDismiss={() => setPageParams({ fromDate: "" })}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {renderResults.isToDateChipRender && (
          <Chip
            value={`To: ${toDate}`}
            onDismiss={() => setPageParams({ toDate: "" })}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {renderResults.isTypeChipRender && (
          <Chip
            value={`Type: ${getChipLabel(typeOptions, type)}`}
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
