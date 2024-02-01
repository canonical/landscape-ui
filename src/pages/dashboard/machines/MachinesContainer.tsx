import { FC, useState } from "react";
import {
  SearchAndFilterChip,
  SearchAndFilterData,
} from "@canonical/react-components/dist/components/SearchAndFilter/types";
import useComputers from "../../../hooks/useComputers";
import MachineList from "./MachineList";
import LoadingState from "../../../components/layout/LoadingState";
import TablePagination from "../../../components/layout/TablePagination";
import classes from "./MachinesContainer.module.scss";
import SearchAndFilterWithDescription from "../../../components/form/SearchAndFilterWithDescription";
import SearchHelpPopup from "../../../components/layout/SearchHelpPopup";
import { MACHINE_SEARCH_HELP_TERMS } from "./_data";
import { useSavedSearches } from "../../../hooks/useSavedSearches";
import useDebug from "../../../hooks/useDebug";
import { useLocation } from "react-router-dom";
import { Computer } from "../../../types/Computer";
import { Select } from "@canonical/react-components";
import { SelectOption } from "../../../types/SelectOption";

const osFilterOptions: SelectOption[] = [
  { label: "All", value: "" },
  { label: "Ubuntu", value: "NOT distribution:windows" },
  { label: "Windows", value: "distribution:windows" },
];

interface MachinesContainerProps {
  selectedMachines: Computer[];
  setSelectedMachines: (machines: Computer[]) => void;
}

const MachinesContainer: FC<MachinesContainerProps> = ({
  selectedMachines,
  setSelectedMachines,
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

  const debug = useDebug();

  const { getComputersQuery } = useComputers();
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
    data: getComputersQueryResult,
    isLoading: getComputersQueryLoading,
    error: getComputersQueryError,
  } = getComputersQuery({
    query: `${searchAndFilterChips
      .map(({ lead, value }) => (lead ? `${lead}:${value}` : value))
      .join(" ")}${osFilter ?? ""}`.trim(),
    root_only: groupBy === "parent",
    limit: pageLimit,
    offset: (currentPage - 1) * pageLimit,
  });

  if (getComputersQueryError) {
    debug(getComputersQueryError);
  }

  const computers = getComputersQueryResult?.data.results ?? [];
  const computersCount = getComputersQueryResult?.data.count ?? 0;

  const handlePaginate = (page: number) => {
    setCurrentPage(page);
    setSelectedMachines([]);
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
            setSelectedMachines([]);
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
            setSelectedMachines([]);
            setOsFilter(event.target.value);
          }}
        />
      </div>
      <SearchHelpPopup
        open={showSearchHelp}
        data={MACHINE_SEARCH_HELP_TERMS}
        onClose={() => {
          setShowSearchHelp(false);
        }}
      />
      {getComputersQueryLoading ? (
        <LoadingState />
      ) : (
        <MachineList
          machines={computers}
          selectedMachines={selectedMachines}
          setSelectedMachines={(machines) => {
            setSelectedMachines(machines);
          }}
          groupBy={groupBy}
        />
      )}
      <TablePagination
        currentPage={currentPage}
        totalItems={computersCount}
        paginate={handlePaginate}
        pageSize={pageLimit}
        setPageSize={(itemsNumber) => {
          setPageLimit(itemsNumber);
        }}
        currentItemCount={computers.length}
      />
    </>
  );
};

export default MachinesContainer;
