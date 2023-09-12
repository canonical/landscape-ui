import { FC, useEffect, useState } from "react";
import { SearchAndFilterChip } from "@canonical/react-components/dist/components/SearchAndFilter/types";
import useComputers from "../../../hooks/useComputers";
import MachineList from "./MachineList";
import LoadingState from "../../../components/layout/LoadingState";
import TablePagination from "../../../components/layout/TablePagination";
import classes from "./MachinesContainer.module.scss";
import { searchAndFilterData } from "../../../data/machines";
import SearchAndFilterWithDescription from "../../../components/form/SearchAndFilterWithDescription";
import SearchHelpPopup from "../../../components/layout/SearchHelpPopup";
import { MACHINE_SEARCH_HELP_TERMS } from "./_data";

const TOTAL_MACHINES = 9;

interface MachinesContainerProps {
  setVisualTitle: (title: string) => void;
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
}

const MachinesContainer: FC<MachinesContainerProps> = ({
  setVisualTitle,
  selectedIds,
  setSelectedIds,
}) => {
  const [searchAndFilterChips, setSearchAndFilterChips] = useState<
    SearchAndFilterChip[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const [showSearchHelp, setShowSearchHelp] = useState(false);

  const query = searchAndFilterChips
    .filter(({ quoteValue }) => quoteValue)
    .map(({ value }) => value)
    .join(" ");

  const { getComputersQuery } = useComputers();

  const { data: getComputersQueryResult, isLoading: getComputersQueryLoading } =
    getComputersQuery({
      query,
      with_network: searchAndFilterChips.find(
        ({ value }) => "with_network" === value,
      )
        ? true
        : undefined,
      with_annotations: searchAndFilterChips.find(
        ({ value }) => "with_annotations" === value,
      )
        ? true
        : undefined,
      with_hardware: searchAndFilterChips.find(
        ({ value }) => "with_hardware" === value,
      )
        ? true
        : undefined,
      limit: pageLimit,
      offset: (currentPage - 1) * pageLimit,
    });

  const computers = getComputersQueryResult?.data ?? [];

  useEffect(() => {
    setVisualTitle(`${TOTAL_MACHINES} machines`);
  }, []);

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
            returnSearchData={setSearchAndFilterChips}
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
          setSelectedIds={setSelectedIds}
        />
      )}
      <TablePagination
        currentPage={currentPage}
        totalPages={Math.ceil(TOTAL_MACHINES / pageLimit)}
        paginate={handlePaginate}
        itemsPerPage={pageLimit}
        setItemsPerPage={setPageLimit}
        description={
          TOTAL_MACHINES > 0 &&
          `Showing ${computers.length} of ${TOTAL_MACHINES} machines`
        }
      />
    </>
  );
};

export default MachinesContainer;
