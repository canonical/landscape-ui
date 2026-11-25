import { SidePanelTableFilterChips, TableFilter } from "@/components/filter";
import ResponsiveTableFilters from "@/components/filter/ResponsiveTableFilters";
import SearchBoxWithDescriptionButton from "@/components/form/SearchBoxWithDescriptionButton";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useGetActivityTypes } from "../../api";
import type { ActivityCommon } from "../../types";
import ActivitiesActions from "../ActivitiesActions";
import ActivitiesDateFilter from "../ActivitiesDateFilter";
import ActivityTypeFilter from "../ActivityTypeFilter";
import classes from "./ActivitiesHeader.module.scss";
import {
  ACTIVITY_SEARCH_HELP_TERMS,
  ACTIVITY_STATUS_OPTIONS,
} from "./constants";
import type { ActivitiesFilters } from "./types";

interface ActivitiesHeaderProps {
  readonly selected: ActivityCommon[];
  readonly resetSelectedIds: () => void;
  readonly filters: ActivitiesFilters;
  readonly onChangeFilters: (values: Partial<ActivitiesFilters>) => void;
  readonly searchHelpTerms: Readonly<
    Record<keyof typeof ACTIVITY_SEARCH_HELP_TERMS, boolean>
  >;
  readonly availableActions: Readonly<
    Record<"approve" | "cancel" | "redo", boolean>
  >;
  readonly availableFilters: Readonly<
    Record<"status" | "type" | "date", boolean>
  >;
  readonly alwaysCollapse?: boolean;
  readonly isAllSelected?: boolean;
  readonly onExport?: () => void;
}

const ActivitiesHeader: FC<ActivitiesHeaderProps> = ({
  resetSelectedIds,
  selected,
  filters,
  onChangeFilters,
  searchHelpTerms,
  availableActions,
  availableFilters,
  alwaysCollapse,
  isAllSelected = false,
  onExport,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [showSearchHelp, setShowSearchHelp] = useState(false);

  const { query } = filters;

  const { activityTypes } = useGetActivityTypes({
    enabled: availableFilters.type,
  });

  const activityResultOptions = activityTypes.map((activityType) => ({
    label: activityType,
    value: activityType,
  }));

  useEffect(() => {
    // Intentional prop->state sync: resets the search input when the query
    // filter changes externally (e.g. browser back/forward).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchText(query ?? "");
  }, [query]);

  const ACTIVITY_TYPE_OPTIONS = [
    { label: "All", value: "" },
    ...activityResultOptions,
  ];

  const changeFilters = (values: Partial<ActivitiesFilters>) => {
    onChangeFilters(values);
    resetSelectedIds();
  };

  const handleSearch = () => {
    const nextQuery = searchText.trim();
    if (!nextQuery) {
      return;
    }

    changeFilters({ query: nextQuery });
  };

  const handleClear = () => {
    changeFilters({ query: "" });
  };

  const filterComponents = [];
  const filterChips = [];

  if (availableFilters.status) {
    filterComponents.push(
      <TableFilter
        key="status"
        type="single"
        label="Status"
        options={ACTIVITY_STATUS_OPTIONS}
        selectedItem={filters.status}
        onItemSelect={(status) => {
          changeFilters({ status });
        }}
        hasToggleIcon
        hasBadge
      />,
    );
    filterChips.push({
      label: "Status",
      item: filters.status
        ? ACTIVITY_STATUS_OPTIONS.find(
            (option) => option.value === filters.status,
          )?.label
        : undefined,
      clear: () => {
        changeFilters({ status: "" });
      },
    });
  }

  if (availableFilters.type) {
    filterComponents.push(
      <ActivityTypeFilter
        key="type"
        label="Type"
        options={ACTIVITY_TYPE_OPTIONS}
        type={filters.type}
        onItemSelect={(type) => {
          changeFilters({ type });
        }}
      />,
    );
    filterChips.push({
      label: "Type",
      item: filters.type,
      clear: () => {
        changeFilters({ type: "" });
      },
    });
  }

  if (availableFilters.date) {
    filterComponents.push(
      <ActivitiesDateFilter
        key="date-range"
        label="Date range"
        fromDate={filters.fromDate}
        toDate={filters.toDate}
        onChange={changeFilters}
      />,
    );
    filterChips.push(
      {
        label: "From",
        item: filters.fromDate,
        clear: () => {
          changeFilters({ fromDate: "" });
        },
      },
      {
        label: "To",
        item: filters.toDate,
        clear: () => {
          changeFilters({ toDate: "" });
        },
      },
    );
  }

  return (
    <>
      <div className={classes.top}>
        <SearchBoxWithDescriptionButton
          inputValue={searchText}
          onInputChange={(inputValue) => {
            setSearchText(inputValue);
          }}
          onSearchClick={handleSearch}
          onDescriptionClick={() => {
            setShowSearchHelp(true);
          }}
          onClear={handleClear}
        />
        <div className={classes.actions}>
          {filterComponents.length > 0 && (
            <ResponsiveTableFilters
              collapseFrom="xl"
              filters={filterComponents}
              isCollapsed={alwaysCollapse}
            />
          )}

          <ActivitiesActions
            selected={selected}
            isAllSelected={isAllSelected}
            onExport={onExport}
            availableActions={availableActions}
            alwaysCollapse={alwaysCollapse}
          />
        </div>
      </div>
      <SearchHelpPopup
        open={showSearchHelp}
        data={(
          Object.keys(
            ACTIVITY_SEARCH_HELP_TERMS,
          ) as (keyof typeof ACTIVITY_SEARCH_HELP_TERMS)[]
        )
          .filter((term) => searchHelpTerms[term])
          .map((term) => ACTIVITY_SEARCH_HELP_TERMS[term])}
        onClose={() => {
          setShowSearchHelp(false);
        }}
      />
      <SidePanelTableFilterChips
        filters={filterChips}
        clearAll={() => {
          changeFilters({
            query: "",
            ...(availableFilters.status ? { status: "" } : {}),
            ...(availableFilters.type ? { type: "" } : {}),
            ...(availableFilters.date ? { fromDate: "", toDate: "" } : {}),
          });
        }}
      />
    </>
  );
};

export default ActivitiesHeader;
