import {
  PageParamFilter,
  SidePanelTableFilterChips,
  TableFilter,
  TableFilterChips,
} from "@/components/filter";
import ResponsiveTableFilters from "@/components/filter/ResponsiveTableFilters";
import SearchBoxWithDescriptionButton from "@/components/form/SearchBoxWithDescriptionButton";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import usePageParams from "@/hooks/usePageParams";
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
  ACTIVITY_DETAIL_SEARCH_HELP_TERMS,
  ACTIVITY_STATUS_OPTIONS,
} from "./constants";
import type { ActivitiesFilterControls, ActivitiesFilters } from "./types";

interface ActivitiesHeaderProps {
  readonly selected: ActivityCommon[];
  readonly resetSelectedIds: () => void;
  readonly isAllSelected?: boolean;
  readonly isDetailView?: boolean;
  readonly filterControls?: ActivitiesFilterControls;
  readonly onExport?: () => void;
}

const ActivitiesHeader: FC<ActivitiesHeaderProps> = ({
  resetSelectedIds,
  selected,
  isAllSelected = false,
  isDetailView = false,
  filterControls,
  onExport,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [showSearchHelp, setShowSearchHelp] = useState(false);

  const pageParams = usePageParams();
  const filters = filterControls?.values ?? pageParams;
  const { query } = filters;
  const { activityTypes } = useGetActivityTypes(isDetailView);
  const typeOptions = [
    { label: "All", value: "" },
    ...activityTypes.map((type) => ({ label: type, value: type })),
  ];
  const changeFilters = (values: Partial<ActivitiesFilters>) => {
    (filterControls?.onChange ?? pageParams.setPageParams)(values);
    resetSelectedIds();
  };

  useEffect(() => {
    // Intentional prop->state sync: resets the search input when the URL query
    // param changes externally (e.g. browser back/forward).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchText(query ?? "");
  }, [query]);

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
          <ResponsiveTableFilters
            collapseFrom="xl"
            isCollapsed={filterControls !== undefined}
            filters={[
              filterControls ? (
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
                />
              ) : (
                <PageParamFilter
                  key="status"
                  pageParamKey="status"
                  label="Status"
                  options={ACTIVITY_STATUS_OPTIONS}
                  onChange={resetSelectedIds}
                />
              ),
              ...(isDetailView
                ? [
                    <ActivityTypeFilter
                      key="type"
                      label="Type"
                      options={typeOptions}
                      onChange={resetSelectedIds}
                      selection={
                        filterControls
                          ? {
                              value: filters.type,
                              onSelect: (type) => {
                                filterControls.onChange({ type });
                              },
                            }
                          : undefined
                      }
                    />,
                  ]
                : []),
              <ActivitiesDateFilter
                key="date-range"
                label="Date range"
                filterControls={{
                  values: {
                    fromDate: filters.fromDate,
                    toDate: filters.toDate,
                  },
                  onChange: changeFilters,
                }}
              />,
            ]}
          />

          {isDetailView && (
            <ActivitiesActions
              selected={selected}
              isAllSelected={isAllSelected}
              onExport={onExport}
              alwaysCollapse={filterControls !== undefined}
            />
          )}
        </div>
      </div>
      <SearchHelpPopup
        open={showSearchHelp}
        data={
          isDetailView
            ? ACTIVITY_DETAIL_SEARCH_HELP_TERMS
            : ACTIVITY_SEARCH_HELP_TERMS
        }
        onClose={() => {
          setShowSearchHelp(false);
        }}
      />
      {filterControls ? (
        <SidePanelTableFilterChips
          filters={[
            {
              label: "Status",
              item: filters.status
                ? ACTIVITY_STATUS_OPTIONS.find(
                    (option) => option.value === filters.status,
                  )?.label
                : undefined,
              clear: () => {
                changeFilters({ status: "" });
              },
            },
            {
              label: "Type",
              item: filters.type,
              clear: () => {
                changeFilters({ type: "" });
              },
            },
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
          ]}
          clearAll={() => {
            changeFilters({
              query: "",
              status: "",
              type: "",
              fromDate: "",
              toDate: "",
            });
          }}
        />
      ) : (
        <TableFilterChips
          filtersToDisplay={
            isDetailView
              ? ["status", "type", "fromDate", "toDate"]
              : ["status", "fromDate", "toDate"]
          }
          statusOptions={ACTIVITY_STATUS_OPTIONS}
          typeOptions={typeOptions}
          onChange={resetSelectedIds}
        />
      )}
    </>
  );
};

export default ActivitiesHeader;
