import { PageParamFilter, TableFilterChips } from "@/components/filter";
import ResponsiveTableFilters from "@/components/filter/ResponsiveTableFilters";
import SearchBoxWithDescriptionButton from "@/components/form/SearchBoxWithDescriptionButton";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import {
  ActivitiesDateFilter,
  ACTIVITY_SEARCH_HELP_TERMS,
  ACTIVITY_STATUS_OPTIONS,
  ActivityTypeFilter,
} from "@/features/activities";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { useGetStaffActivityTypes } from "../../api";
import classes from "./SupportInstanceActivitiesHeader.module.scss";

interface SupportInstanceActivitiesHeaderProps {
  /** The account whose activity types fill the type filter. */
  readonly name: string;
}

/** The search and filters of an instance's activities. There are no actions. */
const SupportInstanceActivitiesHeader: FC<
  SupportInstanceActivitiesHeaderProps
> = ({ name }) => {
  const { query, setPageParams, createPageParamsSetter } = usePageParams();
  const { staffActivityTypes } = useGetStaffActivityTypes(name);

  const [searchText, setSearchText] = useState(query);
  const [showSearchHelp, setShowSearchHelp] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchText(query);
  }, [query]);

  const typeOptions = useMemo(
    () => [
      { label: "All", value: "" },
      ...staffActivityTypes.map((type) => ({ label: type, value: type })),
    ],
    [staffActivityTypes],
  );

  const handleSearch = () => {
    const nextQuery = searchText.trim();

    if (nextQuery) {
      setPageParams({ query: nextQuery });
    }
  };

  return (
    <>
      <div className={classes.top}>
        <SearchBoxWithDescriptionButton
          inputValue={searchText}
          onInputChange={setSearchText}
          onSearchClick={handleSearch}
          onDescriptionClick={() => {
            setShowSearchHelp(true);
          }}
          onClear={createPageParamsSetter({ query: "" })}
        />
        <div className={classes.filters}>
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
                options={typeOptions}
              />,
              <ActivitiesDateFilter key="date-range" label="Date range" />,
            ]}
          />
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
        typeOptions={typeOptions}
      />
    </>
  );
};

export default SupportInstanceActivitiesHeader;
