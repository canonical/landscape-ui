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
import { SelectOption } from "@/types/SelectOption";

const osFilterOptions: SelectOption[] = [
  { label: "All", value: "" },
  { label: "Ubuntu", value: "NOT distribution:windows" },
  { label: "Windows", value: "distribution:windows" },
];

const statusOptions: SelectOption[] = [
  { label: "All", value: "" },
  {
    label: "Up to date",
    value: "NOT alert:package-upgrades",
  },
  {
    label: "Package upgrades",
    value: "alert:package-upgrades",
  },
  {
    label: "Security upgrades",
    value: "alert:security-upgrades",
  },
  {
    label: "Package profiles",
    value: "alert:package-profiles",
  },
  {
    label: "Package reporter",
    value: "alert:package-reporter",
  },
  {
    label: "ESM disabled",
    value: "alert:esm-disabled",
  },
  {
    label: "Computer offline",
    value: "alert:computer-offline",
  },
  {
    label: "Computer online",
    value: "NOT alert:computer-offline",
  },
  {
    label: "Computer reboot",
    value: "alert:computer-reboot",
  },
  {
    label: "Computer duplicates",
    value: "alert:computer-duplicates",
  },
  {
    label: "Unapproved activities",
    value: "alert:unapproved-activities",
  },
];

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
      .join(" ")}${osFilter ?? ""}${statusFilter ?? ""}`.trim(),
    root_only: groupBy === "parent",
    with_alerts: true,
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
          label="Group by"
          wrapperClassName={classes.select}
          className="u-no-margin--bottom"
          options={[
            { label: "None", value: "" },
            { label: "Parent", value: "parent" },
          ]}
          value={groupBy}
          onChange={(event) => {
            setSelectedInstances([]);
            setGroupBy(event.target.value);
          }}
        />
        <Select
          label="OS"
          wrapperClassName={classes.select}
          className="u-no-margin--bottom"
          options={osFilterOptions}
          value={osFilter}
          onChange={(event) => {
            setSelectedInstances([]);
            setOsFilter(event.target.value);
          }}
        />
        <Select
          label="Status"
          wrapperClassName={classes.select}
          className="u-no-margin--bottom"
          options={statusOptions}
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
