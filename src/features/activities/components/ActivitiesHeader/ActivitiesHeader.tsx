import { PageParamFilter, TableFilterChips } from "@/components/filter";
import ResponsiveTableFilters from "@/components/filter/ResponsiveTableFilters";
import SearchBoxWithDescriptionButton from "@/components/form/SearchBoxWithDescriptionButton";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import usePageParams from "@/hooks/usePageParams";
import type { UrlParams } from "@/types/UrlParams";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
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

interface ActivitiesHeaderProps {
  readonly selected: ActivityCommon[];
  readonly resetSelectedIds: () => void;
  readonly activityCount?: number;
  readonly isAllSelected?: boolean;
}

const ActivitiesHeader: FC<ActivitiesHeaderProps> = ({
  resetSelectedIds,
  selected,
  activityCount,
  isAllSelected = false,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [showSearchHelp, setShowSearchHelp] = useState(false);

  const { query, setPageParams, createPageParamsSetter } = usePageParams();
  const { instanceId } = useParams<UrlParams>();

  const { activityTypes } = useGetActivityTypes();

  const activityResultOptions = activityTypes.map((activityType) => ({
    label: activityType,
    value: activityType,
  }));

  useEffect(() => {
    // Intentional prop->state sync: resets the search input when the URL query
    // param changes externally (e.g. browser back/forward).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchText(query ?? "");
  }, [query]);

  const ACTIVITY_TYPE_OPTIONS = [
    { label: "All", value: "" },
    ...activityResultOptions,
  ];

  const IS_PANEL = !!instanceId;

  const handleSearch = () => {
    const nextQuery = searchText.trim();
    if (!nextQuery) {
      return;
    }

    setPageParams({ query: nextQuery });
    resetSelectedIds();
  };

  const handleClear = createPageParamsSetter({ query: "" });

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
            filters={[
              <PageParamFilter
                key="status"
                pageParamKey="status"
                label="Status"
                options={ACTIVITY_STATUS_OPTIONS}
              />,
              <ActivityTypeFilter
                key="type"
                label="Type"
                options={ACTIVITY_TYPE_OPTIONS}
              />,
              <ActivitiesDateFilter key="date-range" label="Date range" />,
            ]}
          />

          {IS_PANEL && (
            <ActivitiesActions
              selected={selected}
              activityCount={activityCount}
              isAllSelected={isAllSelected}
              exportBaseQuery={instanceId ? `computer:id:${instanceId}` : ""}
            />
          )}
        </div>
      </div>
      <SearchHelpPopup
        open={showSearchHelp}
        data={ACTIVITY_SEARCH_HELP_TERMS}
        onClose={() => {
          setShowSearchHelp(false);
        }}
      />
      <TableFilterChips
        filtersToDisplay={["status", "type", "fromDate", "toDate"]}
        statusOptions={ACTIVITY_STATUS_OPTIONS}
        typeOptions={ACTIVITY_TYPE_OPTIONS}
      />
    </>
  );
};

export default ActivitiesHeader;
