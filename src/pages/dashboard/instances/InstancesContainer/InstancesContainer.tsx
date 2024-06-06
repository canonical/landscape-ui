import { FC, useState } from "react";
import { Select } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  ExtendedSearchAndFilterChip,
  SearchBoxWithSavedSearches,
} from "@/features/saved-searches";
import useInstances from "@/hooks/useInstances";
import InstanceList from "@/pages/dashboard/instances/InstanceList";
import { Instance } from "@/types/Instance";
import { FILTERS, INSTANCE_SEARCH_HELP_TERMS } from "./constants";
import classes from "./InstancesContainer.module.scss";
import PendingInstancesNotification from "@/pages/dashboard/instances/PendingInstancesNotification";
import { usePageParams } from "@/hooks/usePageParams";
import { getOptionQuery } from "./helpers";

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
  const [showSearchHelp, setShowSearchHelp] = useState(false);

  const {
    os: osFilter,
    groupBy: groupBy,
    status: status,
    currentPage,
    pageSize,
    setPageParams,
  } = usePageParams();

  const { getInstancesQuery } = useInstances();

  const queryStatus = getOptionQuery(FILTERS.status, status);
  const queryOsFilter = getOptionQuery(FILTERS.os, osFilter);
  const queryGroupBy = getOptionQuery(FILTERS.groupBy, groupBy);

  const { data: getInstancesQueryResult, isLoading: getInstancesQueryLoading } =
    getInstancesQuery({
      query: `${searchAndFilterChips
        .map(({ lead, value, title }) =>
          lead && title ? `${lead}:${title}` : value,
        )
        .join(" ")}${queryOsFilter ?? ""} ${queryStatus}`.trim(),
      root_only: queryGroupBy === "parent",
      with_alerts: true,
      with_upgrades: status !== "pending-computers",
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

  const instances = getInstancesQueryResult?.data.results ?? [];
  const instancesCount = getInstancesQueryResult?.data.count ?? 0;

  const handleFilterChange = (filterType: string, filterValue: string) => {
    setPageParams({ [filterType]: filterValue });
  };

  const handleClearSelection = () => {
    setSelectedInstances([]);
  };

  return (
    <>
      <div className={classes.top}>
        <div className={classes.searchContainer}>
          <SearchBoxWithSavedSearches
            existingSearchData={searchAndFilterChips}
            onHelpButtonClick={() => setShowSearchHelp(true)}
            returnSearchData={(searchData) =>
              setSearchAndFilterChips(searchData)
            }
          />
        </div>
        {FILTERS.groupBy.type === "select" && (
          <Select
            label={FILTERS.groupBy.label}
            wrapperClassName={classes.select}
            className="u-no-margin--bottom"
            options={FILTERS.groupBy.options}
            value={groupBy}
            onChange={(event) =>
              handleFilterChange("groupBy", event.target.value)
            }
          />
        )}
        {FILTERS.os.type === "select" && (
          <Select
            label={FILTERS.os.label}
            wrapperClassName={classes.select}
            className="u-no-margin--bottom"
            options={FILTERS.os.options}
            value={osFilter}
            onChange={(event) => handleFilterChange("os", event.target.value)}
          />
        )}
        {FILTERS.status.type === "select" && (
          <Select
            label={FILTERS.status.label}
            wrapperClassName={classes.select}
            className="u-no-margin--bottom"
            options={FILTERS.status.options}
            value={status}
            onChange={(event) =>
              handleFilterChange("status", event.target.value)
            }
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
      <PendingInstancesNotification />
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
        totalItems={instancesCount}
        handleClearSelection={handleClearSelection}
        currentItemCount={instances.length}
      />
    </>
  );
};

export default InstancesContainer;
