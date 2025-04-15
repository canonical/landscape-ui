import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import { Button, Chip, Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { defaultFiltersToDisplay } from "./constants";
import {
  checkRenderConditions,
  filterSearchQuery,
  getChipLabel,
  parseSearchQuery,
} from "./helpers";
import classes from "./TableFilterChips.module.scss";
import type { FilterKey } from "./types";

interface TableFilterChipsProps {
  readonly accessGroupOptions?: SelectOption[];
  readonly autoinstallFileOptions?: SelectOption[];
  readonly availabilityZonesOptions?: SelectOption[];
  readonly employeeGroupOptions?: SelectOption[];
  readonly filtersToDisplay?: FilterKey[];
  readonly osOptions?: SelectOption[];
  readonly statusOptions?: SelectOption[];
  readonly tagOptions?: SelectOption[];
  readonly typeOptions?: SelectOption[];
}

const TableFilterChips: FC<TableFilterChipsProps> = ({
  accessGroupOptions,
  availabilityZonesOptions,
  autoinstallFileOptions,
  employeeGroupOptions,
  filtersToDisplay,
  osOptions,
  statusOptions,
  tagOptions,
  typeOptions,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hiddenChipCount, setHiddenChipCount] = useState(0);

  const filtersToMonitor = filtersToDisplay ?? defaultFiltersToDisplay;

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    setPageParams,
    accessGroups,
    autoinstallFiles,
    availabilityZones,
    employeeGroups,
    fromDate,
    os,
    statuses,
    tags,
    toDate,
    type,
    search,
    query,
  } = usePageParams();

  const handleClearAllFilters = () => {
    setPageParams({
      accessGroups: [],
      autoinstallFiles: [],
      availabilityZones: [],
      employeeGroups: [],
      fromDate: "",
      os: "",
      statuses: [],
      tags: [],
      toDate: "",
      type: "",
      search: "",
      query: "",
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
      setHiddenChipCount(0);
      return;
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
    autoinstallFiles.length,
    employeeGroups.length,
    fromDate,
    hiddenChipCount,
    os,
    statuses.length,
    tags.length,
    toDate,
    type,
    search,
  ]);

  const renderResults = checkRenderConditions({
    accessGroups,
    autoinstallFiles,
    availabilityZones,
    employeeGroups,
    filtersToMonitor,
    fromDate,
    os,
    search,
    statuses,
    tags,
    toDate,
    type,
    query,
  });

  if (renderResults.totalChipsToRenderCount === 0) {
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
          parseSearchQuery(query).map((value, idx) => (
            <Chip
              key={value + idx}
              value={`Query: ${value}`}
              onDismiss={() => {
                setPageParams({ query: filterSearchQuery(query, value) });
              }}
              className="u-no-margin--bottom u-no-margin--right"
            />
          ))}
        {renderResults.isSearchChipRender && (
          <Chip
            value={`Search: ${search}`}
            onDismiss={() => {
              setPageParams({ search: "" });
            }}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {renderResults.areStatusesChipsRender &&
          statuses.map((status, _, array) => (
            <Chip
              key={status}
              value={`Status: ${getChipLabel(statusOptions, status)}`}
              onDismiss={() => {
                setPageParams({
                  statuses: array.filter((item) => item !== status),
                });
              }}
              className="u-no-margin--bottom u-no-margin--right"
            />
          ))}
        {renderResults.isOsChipRender && (
          <Chip
            value={`OS: ${getChipLabel(osOptions, os)}`}
            onDismiss={() => {
              setPageParams({ os: "" });
            }}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {renderResults.areAvailabilityZonesChipsRender &&
          availabilityZones.map((availabilityZone, _, array) => (
            <Chip
              key={availabilityZone}
              value={`Availability z.: ${getChipLabel(availabilityZonesOptions, availabilityZone)}`}
              onDismiss={() => {
                setPageParams({
                  availabilityZones: array.filter(
                    (item) => item !== availabilityZone,
                  ),
                });
              }}
              className="u-no-margin--bottom u-no-margin--right"
            />
          ))}
        {renderResults.areAccessGroupsChipsRender &&
          accessGroups.map((accessGroup, _, array) => (
            <Chip
              key={accessGroup}
              value={`Access group: ${getChipLabel(accessGroupOptions, accessGroup)}`}
              onDismiss={() => {
                setPageParams({
                  accessGroups: array.filter((item) => item !== accessGroup),
                });
              }}
              className="u-no-margin--bottom u-no-margin--right"
            />
          ))}
        {renderResults.areAutoinstallFilesChipsRender &&
          autoinstallFiles.map((autoinstallFile, _, array) => (
            <Chip
              key={autoinstallFile}
              value={`Autoinstall file: ${getChipLabel(autoinstallFileOptions, autoinstallFile)}`}
              onDismiss={() => {
                setPageParams({
                  autoinstallFiles: array.filter(
                    (item) => item !== autoinstallFile,
                  ),
                });
              }}
              className="u-no-margin--bottom u-no-margin--right"
            />
          ))}
        {renderResults.areEmployeeGroupsChipsRender &&
          employeeGroups.map((employeeGroup, _, array) => (
            <Chip
              key={employeeGroup}
              value={`Employee group: ${getChipLabel(employeeGroupOptions, employeeGroup)}`}
              onDismiss={() => {
                setPageParams({
                  employeeGroups: array.filter(
                    (item) => item !== employeeGroup,
                  ),
                });
              }}
              className="u-no-margin--bottom u-no-margin--right"
            />
          ))}
        {renderResults.areTagsChipsRender &&
          tags.map((tag, _, array) => (
            <Chip
              key={tag}
              value={`Tag: ${getChipLabel(tagOptions, tag)}`}
              onDismiss={() => {
                setPageParams({ tags: array.filter((item) => item !== tag) });
              }}
              className="u-no-margin--bottom u-no-margin--right"
            />
          ))}
        {renderResults.isFromDateChipRender && (
          <Chip
            value={`From: ${fromDate}`}
            onDismiss={() => {
              setPageParams({ fromDate: "" });
            }}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {renderResults.isToDateChipRender && (
          <Chip
            value={`To: ${toDate}`}
            onDismiss={() => {
              setPageParams({ toDate: "" });
            }}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {renderResults.isTypeChipRender && (
          <Chip
            value={`Type: ${getChipLabel(typeOptions, type)}`}
            onDismiss={() => {
              setPageParams({ type: "" });
            }}
            className="u-no-margin--bottom u-no-margin--right"
          />
        )}
        {isExpanded && (
          <Button
            type="button"
            appearance="link"
            className={classes.showLessButton}
            onClick={() => {
              setIsExpanded(false);
            }}
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
          onClick={() => {
            setIsExpanded(true);
          }}
        >
          <span className="u-text--muted">{`+${hiddenChipCount}`}</span>
        </Button>
      )}
    </div>
  );
};

export default TableFilterChips;
