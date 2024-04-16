import { FC, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Select } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import TablePagination from "@/components/layout/TablePagination";
import {
  ExtendedSearchAndFilterChip,
  SearchBoxWithSavedSearches,
} from "@/features/saved-searches";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import InstanceList from "@/pages/dashboard/instances/InstanceList";
import { Instance } from "@/types/Instance";
import {
  GROUP_BY_FILTER,
  INSTANCE_SEARCH_HELP_TERMS,
  OS_FILTER,
  QUERY_STATUSES,
  STATUS_FILTER,
} from "./constants";
import classes from "./InstancesContainer.module.scss";

interface InstancesContainerProps {
  selectedInstances: Instance[];
  setSelectedInstances: (instances: Instance[]) => void;
}

const InstancesContainer: FC<InstancesContainerProps> = ({
  selectedInstances,
  setSelectedInstances,
}) => {
  const [searchAndFilterChips, setSearchAndFilterChips] = useState<
    ExtendedSearchAndFilterChip[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const [showSearchHelp, setShowSearchHelp] = useState(false);
  const [groupBy, setGroupBy] = useState("");
  const [osFilter, setOsFilter] = useState("");

  const location: { state: { chipData?: ExtendedSearchAndFilterChip } | null } =
    useLocation();

  const chipData = location.state?.chipData;

  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );

  const debug = useDebug();

  const { getInstancesQuery } = useInstances();

  const queryStatus = QUERY_STATUSES[statusFilter];

  const {
    data: getInstancesQueryResult,
    isLoading: getInstancesQueryLoading,
    error: getInstancesQueryError,
  } = getInstancesQuery({
    query: `${searchAndFilterChips
      .map(({ lead, value, title }) =>
        lead && title ? `${lead}:${title}` : value,
      )
      .join(" ")}${osFilter ?? ""} ${queryStatus}`.trim(),
    root_only: groupBy === "parent",
    with_alerts: true,
    with_upgrades: statusFilter !== "pending-computers",
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
          <SearchBoxWithSavedSearches
            existingSearchData={chipData ? [chipData] : undefined}
            onHelpButtonClick={() => setShowSearchHelp(true)}
            returnSearchData={(searchData) =>
              setSearchAndFilterChips(searchData)
            }
          />
        </div>
        {GROUP_BY_FILTER.type === "select" && (
          <Select
            label={GROUP_BY_FILTER.label}
            wrapperClassName={classes.select}
            className="u-no-margin--bottom"
            options={GROUP_BY_FILTER.options}
            value={groupBy}
            onChange={(event) => {
              setSelectedInstances([]);
              setGroupBy(event.target.value);
            }}
          />
        )}
        {OS_FILTER.type === "select" && (
          <Select
            label={OS_FILTER.label}
            wrapperClassName={classes.select}
            className="u-no-margin--bottom"
            options={OS_FILTER.options}
            value={osFilter}
            onChange={(event) => {
              setSelectedInstances([]);
              setOsFilter(event.target.value);
            }}
          />
        )}
        {STATUS_FILTER.type === "select" && (
          <Select
            label={STATUS_FILTER.label}
            wrapperClassName={classes.select}
            className="u-no-margin--bottom"
            options={STATUS_FILTER.options}
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
        )}
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
