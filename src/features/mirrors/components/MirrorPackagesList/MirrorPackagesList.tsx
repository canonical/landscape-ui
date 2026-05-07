import { useMemo, type FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { useListMirrorPackages } from "../../api";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import type { CellProps, Column } from "react-table";
import { useCounter } from "usehooks-ts";

interface MirrorPackagesListProps {
  readonly mirrorName: string;
}

const MirrorPackagesList: FC<MirrorPackagesListProps> = ({ mirrorName }) => {
  const { data, isPending, error } = useListMirrorPackages(mirrorName, {
    pageSize: 1000,
  });

  const { count: currentPage, increment, decrement } = useCounter(1);

  const columns = useMemo<Column<{ packageName: string }>[]>(
    () => [
      {
        Header: "Package name",
        Cell: ({
          row: {
            original: { packageName },
          },
        }: CellProps<{ packageName: string }>) => packageName,
      },
    ],
    [],
  );

  if (isPending) {
    return <LoadingState />;
  }

  if (error) {
    throw error;
  }

  const formattedPackages =
    data.data.mirrorPackages?.map((packageName) => ({ packageName })) || [];

  const pagedPackages = formattedPackages.slice(
    (currentPage - 1) * DEFAULT_MODAL_PAGE_SIZE,
    currentPage * DEFAULT_MODAL_PAGE_SIZE,
  );

  return (
    <>
      <ResponsiveTable
        columns={columns}
        data={pagedPackages}
        emptyMsg={"No packages associated with this mirror."}
        minWidth={320}
      />
      <ModalTablePagination
        current={currentPage}
        max={Math.ceil(formattedPackages.length / DEFAULT_MODAL_PAGE_SIZE)}
        onNext={increment}
        onPrev={decrement}
      />
    </>
  );
};

export default MirrorPackagesList;
