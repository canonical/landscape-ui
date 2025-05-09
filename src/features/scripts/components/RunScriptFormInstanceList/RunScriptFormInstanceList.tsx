import LoadingState from "@/components/layout/LoadingState";
import TablePaginationBase from "@/components/layout/TablePagination/components/TablePaginationBase";
import { currentInstanceCan } from "@/features/instances";
import useInstances from "@/hooks/useInstances";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/libs/pageParamsManager/constants";
import type { Instance } from "@/types/Instance";
import { ModularTable } from "@canonical/react-components";
import { useMemo, useState, type FC } from "react";
import type { CellProps, Column } from "react-table";
import classes from "./RunScriptFormInstanceList.module.scss";

interface RunScriptFormInstanceListProps {
  readonly query?: string;
}

const RunScriptFormInstanceList: FC<RunScriptFormInstanceListProps> = ({
  query,
}) => {
  const { getInstancesQuery } = useInstances();

  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { data: response, isLoading } = getInstancesQuery({
    query,
  });

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        Header: "Instance",
        Cell: ({ row: { original: instance } }: CellProps<Instance>) =>
          instance.title,
      },
    ],
    [],
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (!response) {
    throw new Error();
  }

  const instances = response.data.results.filter((instance) => {
    return currentInstanceCan("runScripts", instance);
  });

  const offset = (currentPage - 1) * pageSize;

  const currentInstances = instances.slice(offset, offset + pageSize);

  return (
    <>
      <ModularTable
        columns={columns}
        data={currentInstances}
        className={classes.table}
      />

      <TablePaginationBase
        className={classes.pagination}
        currentItemCount={currentInstances.length}
        currentPage={currentPage}
        pageSize={pageSize}
        paginate={setCurrentPage}
        setPageSize={setPageSize}
        totalItems={instances.length}
      />
    </>
  );
};

export default RunScriptFormInstanceList;
