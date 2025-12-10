import TablePaginationBase from "@/components/layout/TablePagination/components/TablePaginationBase";
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
  readonly instances: Instance[];
}

const RunScriptFormInstanceList: FC<RunScriptFormInstanceListProps> = ({
  instances,
}) => {
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

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

  const offset = (currentPage - 1) * pageSize;

  const currentInstances = instances.slice(offset, offset + pageSize);

  return (
    <>
      <ModularTable columns={columns} data={currentInstances} />

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
