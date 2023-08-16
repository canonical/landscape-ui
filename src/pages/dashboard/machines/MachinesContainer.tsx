import { FC, useEffect, useState } from "react";
import { SearchAndFilterChip } from "@canonical/react-components/dist/components/SearchAndFilter/types";
import { useComputers } from "../../../hooks/useComputers";
import MachineList from "./MachineList";
import LoadingState from "../../../components/layout/LoadingState";
import TablePagination from "../../../components/layout/TablePagination";
import classes from "./MachinesContainer.module.scss";

const TOTAL_MACHINES = 9;

interface MachinesContainerProps {
  searchAndFilterChips: SearchAndFilterChip[];
  setVisualTitle: (title: string) => void;
  selectedIds: number[];
  setSelectedIds: (ids: number[] | ((prev: number[]) => number[])) => void;
}

const MachinesContainer: FC<MachinesContainerProps> = ({
  searchAndFilterChips,
  setVisualTitle,
  selectedIds,
  setSelectedIds,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);

  const query = searchAndFilterChips
    .filter(({ quoteValue }) => quoteValue)
    .map(({ value }) => value)
    .join(" ");

  const { getComputersQuery } = useComputers();

  const { data: getComputersQueryResult, isLoading: getComputersQueryLoading } =
    getComputersQuery({
      query,
      with_network: searchAndFilterChips.find(
        ({ value }) => "with_network" === value
      )
        ? true
        : undefined,
      with_annotations: searchAndFilterChips.find(
        ({ value }) => "with_annotations" === value
      )
        ? true
        : undefined,
      with_hardware: searchAndFilterChips.find(
        ({ value }) => "with_hardware" === value
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

  return (
    <>
      <div className={classes.widgets}>
        <h3 className="p-heading--5 u-no-margin--bottom">
          {`Showing ${computers.length} of ${TOTAL_MACHINES} machines`}
        </h3>
        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(TOTAL_MACHINES / pageLimit)}
          paginate={setCurrentPage}
          itemsPerPage={pageLimit}
          setItemsPerPage={setPageLimit}
        />
      </div>
      {getComputersQueryLoading ? (
        <LoadingState />
      ) : (
        <MachineList
          machines={computers}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      )}
    </>
  );
};

export default MachinesContainer;
