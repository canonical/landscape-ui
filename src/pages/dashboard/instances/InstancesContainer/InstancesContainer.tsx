import { FC, useState } from "react";
import {
  SearchAndFilterChip,
  SearchAndFilterData,
} from "@canonical/react-components/dist/components/SearchAndFilter/types";
import useInstances from "@/hooks/useInstances";
import InstanceList from "../InstanceList/InstanceList";
import LoadingState from "@/components/layout/LoadingState";
import TablePagination from "@/components/layout/TablePagination";
import classes from "./InstancesContainer.module.scss";
import SearchAndFilterWithDescription from "@/components/form/SearchAndFilterWithDescription";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import { INSTANCE_SEARCH_HELP_TERMS } from "../_data";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import useDebug from "@/hooks/useDebug";
import { useLocation, useSearchParams } from "react-router-dom";
import { Instance } from "@/types/Instance";
import { Select } from "@canonical/react-components";
import {
  GROUP_BY_FILTER,
  OS_FILTER,
  QUERY_STATUSES,
  STATUS_FILTER,
} from "./constants";

interface InstancesContainerProps {
  selectedInstances: Instance[];
  setSelectedInstances: (instances: Instance[]) => void;
}

const InstancesContainer: FC<InstancesContainerProps> = ({
  selectedInstances,
  setSelectedInstances,
}) => {
  const [searchAndFilterChips, setSearchAndFilterChips] = useState<
    SearchAndFilterChip[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const [showSearchHelp, setShowSearchHelp] = useState(false);
  const [groupBy, setGroupBy] = useState("");
  const [osFilter, setOsFilter] = useState("");

  const location = useLocation();
  const locationState = location.state as { chipData?: SearchAndFilterChip };

  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );

  const debug = useDebug();

  const { getInstancesQuery } = useInstances();
  const { getSavedSearchesQuery } = useSavedSearches();

  const queryStatus = QUERY_STATUSES[statusFilter];
  const {
    data: getSavedSearchesQueryResult,
    error: getSavedSearchesQueryError,
  } = getSavedSearchesQuery();

  if (getSavedSearchesQueryError) {
    debug(getSavedSearchesQueryError);
  }

  const searchAndFilterData: SearchAndFilterData[] = [
    {
      id: 0,
      heading: "Saved searches",
      chips: (getSavedSearchesQueryResult?.data ?? []).map(({ name }) => ({
        value: name,
        lead: "search",
      })),
    },
  ];

  const {
    data: getInstancesQueryResult,
    isLoading: getInstancesQueryLoading,
    error: getInstancesQueryError,
  } = getInstancesQuery({
    query: `${searchAndFilterChips
      .map(({ lead, value }) => (lead ? `${lead}:${value}` : value))
      .join(" ")}${osFilter ?? ""} ${queryStatus}`.trim(),
    root_only: groupBy === "parent",
    with_alerts: true,
    with_upgrades: true,
    limit: pageLimit,
    offset: (currentPage - 1) * pageLimit,
  });

  if (getInstancesQueryError) {
    debug(getInstancesQueryError);
  }

  const instances = getInstancesQueryResult?.data.results ?? [];
  const instancesCount = getInstancesQueryResult?.data.count ?? 0;

  const handlePaginate = (page: number) => {
    setCurrentPage(page);
    setSelectedInstances([]);
  };

  return (
    <>
      <div className={classes.top}>
        <div className={classes.searchContainer}>
          <SearchAndFilterWithDescription
            existingSearchData={
              locationState?.chipData ? [locationState.chipData] : undefined
            }
            filterPanelData={searchAndFilterData}
            returnSearchData={(searchData) => {
              setSearchAndFilterChips(searchData);
            }}
            onClick={() => {
              setShowSearchHelp(true);
            }}
          />
        </div>
        <Select
          label={GROUP_BY_FILTER.label}
          wrapperClassName={classes.select}
          className="u-no-margin--bottom"
          options={
            GROUP_BY_FILTER.type === "select" ? GROUP_BY_FILTER.options : []
          }
          value={groupBy}
          onChange={(event) => {
            setSelectedInstances([]);
            setGroupBy(event.target.value);
          }}
        />
        <Select
          label={OS_FILTER.label}
          wrapperClassName={classes.select}
          className="u-no-margin--bottom"
          options={OS_FILTER.type === "select" ? OS_FILTER.options : []}
          value={osFilter}
          onChange={(event) => {
            setSelectedInstances([]);
            setOsFilter(event.target.value);
          }}
        />
        <Select
          label={STATUS_FILTER.label}
          wrapperClassName={classes.select}
          className="u-no-margin--bottom"
          options={STATUS_FILTER.type === "select" ? STATUS_FILTER.options : []}
          value={statusFilter}
          onChange={(event) => {
            setSelectedInstances([]);
            setStatusFilter(event.target.value);
            if (event.target.value !== "") {
              setSearchParams({ status: event.target.value });
            } else {
              searchParams.delete("status");
              setSearchParams(searchParams);
            }
          }}
        />
      </div>
      <SearchHelpPopup
        open={showSearchHelp}
        data={INSTANCE_SEARCH_HELP_TERMS}
        onClose={() => {
          setShowSearchHelp(false);
        }}
      />
      {getInstancesQueryLoading ? (
        <LoadingState />
      ) : (
        <InstanceList
          instances={instances}
          selectedInstances={selectedInstances}
          setSelectedInstances={(instances) => {
            setSelectedInstances(instances);
          }}
          groupBy={groupBy}
        />
      )}
      <TablePagination
        currentPage={currentPage}
        totalItems={instancesCount}
        paginate={handlePaginate}
        pageSize={pageLimit}
        setPageSize={(itemsNumber) => {
          setPageLimit(itemsNumber);
        }}
        currentItemCount={instances.length}
      />
    </>
  );
};

export default InstancesContainer;
