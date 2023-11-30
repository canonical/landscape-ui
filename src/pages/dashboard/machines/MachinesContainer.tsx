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

const TOTAL_MACHINES = 9;

interface MachinesContainerProps {
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
}

const MachinesContainer: FC<MachinesContainerProps> = ({
  selectedIds,
  setSelectedIds,
}) => {
  const [searchAndFilterChips, setSearchAndFilterChips] = useState<
    SearchAndFilterChip[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const [showSearchHelp, setShowSearchHelp] = useState(false);

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
    query: searchAndFilterChips
      .map(({ lead, value }) => (lead ? `${lead}:${value}` : value))
      .join(" "),
    limit: pageLimit,
    offset: (currentPage - 1) * pageLimit,
  });

  if (getComputersQueryError) {
    debug(getComputersQueryError);
  }

  const computers = getComputersQueryResult?.data ?? [];

  const handlePaginate = (page: number) => {
    setCurrentPage(page);
    setSelectedIds([]);
  };

  return (
    <>
      <div className={classes.top}>
        <div className={classes.search}>
          <SearchAndFilterWithDescription
            filterPanelData={searchAndFilterData}
            returnSearchData={(searchData) => {
              setSearchAndFilterChips(searchData);
            }}
            onClick={() => {
              setShowSearchHelp(true);
            }}
          />
        </div>
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
          selectedIds={selectedIds}
          setSelectedIds={(ids) => {
            setSelectedIds(ids);
          }}
        />
      )}
      <TablePagination
        currentPage={currentPage}
        totalItems={TOTAL_MACHINES}
        paginate={handlePaginate}
        pageSize={pageLimit}
        setPageSize={(itemsNumber) => {
          setPageLimit(itemsNumber);
        }}
        description={
          TOTAL_MACHINES > 0 &&
          `Showing ${computers.length} of ${TOTAL_MACHINES} machines`
        }
      />
    </>
  );
};

export default MachinesContainer;
