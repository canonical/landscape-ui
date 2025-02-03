import SearchBoxWithDescriptionButton from "@/components/form/SearchBoxWithDescriptionButton";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import usePageParams from "@/hooks/usePageParams";
import { Form } from "@canonical/react-components";
import type { FC, SyntheticEvent } from "react";
import { useState } from "react";
import classes from "./ActivitiesHeader.module.scss";
import {
  ACTIVITY_SEARCH_HELP_TERMS,
  ACTIVITY_STATUS_OPTIONS,
} from "./constants";
import { StatusFilter, TableFilterChips } from "@/components/filter";
import ActivityTypeFilter from "../ActivityTypeFilter";
import { useActivities } from "../../hooks";
import ActivitiesDateFilter from "../ActivitiesDateFilter";
import { useParams } from "react-router";
import type { UrlParams } from "@/types/UrlParams";
import classNames from "classnames";

interface ActivitiesHeaderProps {
  readonly resetSelectedIds: () => void;
}

const ActivitiesHeader: FC<ActivitiesHeaderProps> = ({ resetSelectedIds }) => {
  const { query, setPageParams } = usePageParams();
  const { instanceId } = useParams<UrlParams>();
  const { getActivityTypesQuery } = useActivities();

  const [searchText, setSearchText] = useState<string>("");
  const [showSearchHelp, setShowSearchHelp] = useState(false);

  const { data: activityTypesQueryData } = getActivityTypesQuery();

  const activityTypes = activityTypesQueryData?.data ?? [];

  const activityResultOptions = activityTypes.map((activityType) => ({
    label: activityType,
    value: activityType,
  }));

  const ACTIVITY_TYPE_OPTIONS = [
    { label: "All", value: "" },
    ...activityResultOptions,
  ];

  const IS_STICKY = !!instanceId;

  const handleSearch = () => {
    if (!searchText) {
      return;
    }

    setPageParams({
      query: query ? `${query},${searchText}` : `${searchText}`,
    });
    setSearchText("");
    resetSelectedIds();
  };

  const handleClear = () => {
    setPageParams({ query: "" });
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <>
      <div
        className={classNames(classes.container, {
          [classes.sticky]: !IS_STICKY,
        })}
      >
        <div className={classes.searchContainer}>
          <Form onSubmit={handleSubmit} noValidate>
            <SearchBoxWithDescriptionButton
              inputValue={searchText}
              onInputChange={(inputValue) => {
                setSearchText(inputValue);
              }}
              onSearchClick={handleSearch}
              onDescriptionClick={() => setShowSearchHelp(true)}
              onClear={handleClear}
            />
          </Form>
        </div>
        <div className={classes.filters}>
          <StatusFilter options={ACTIVITY_STATUS_OPTIONS} />
          <ActivityTypeFilter options={ACTIVITY_TYPE_OPTIONS} />
          <ActivitiesDateFilter />
        </div>
      </div>
      <SearchHelpPopup
        open={showSearchHelp}
        data={ACTIVITY_SEARCH_HELP_TERMS}
        onClose={() => setShowSearchHelp(false)}
      />
      <TableFilterChips
        filtersToDisplay={["status", "type", "fromDate", "toDate", "query"]}
        statusOptions={ACTIVITY_STATUS_OPTIONS}
        typeOptions={ACTIVITY_TYPE_OPTIONS}
      />
    </>
  );
};

export default ActivitiesHeader;
