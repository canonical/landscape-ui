import { PageParamFilter, TableFilterChips } from "@/components/filter";
import SearchBoxWithDescriptionButton from "@/components/form/SearchBoxWithDescriptionButton";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import usePageParams from "@/hooks/usePageParams";
import type { UrlParams } from "@/types/UrlParams";
import classNames from "classnames";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useActivities } from "../../hooks";
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
}

const ActivitiesHeader: FC<ActivitiesHeaderProps> = ({
  resetSelectedIds,
  selected,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [showSearchHelp, setShowSearchHelp] = useState(false);

  const { query, setPageParams, createPageParamsSetter } = usePageParams();
  const { instanceId } = useParams<UrlParams>();
  const { getActivityTypesQuery } = useActivities();

  const { data: activityTypesQueryData } = getActivityTypesQuery();

  const activityTypes = activityTypesQueryData?.data ?? [];

  const activityResultOptions = activityTypes.map((activityType) => ({
    label: activityType,
    value: activityType,
  }));

  useEffect(() => {
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
      <div className={classNames(classes.top)}>
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
          <div className={classes.filters}>
            <PageParamFilter
              pageParamKey="status"
              label="Status"
              options={ACTIVITY_STATUS_OPTIONS}
            />
            <ActivityTypeFilter options={ACTIVITY_TYPE_OPTIONS} />
            <ActivitiesDateFilter />
          </div>

          {IS_PANEL && <ActivitiesActions selected={selected} />}
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
