import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { Mirror } from "@canonical/landscape-openapi";
import { Button } from "@canonical/react-components";
import moment from "moment";
import { Suspense, useMemo, type FC } from "react";
import type { CellProps, Column } from "react-table";
import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import usePageParams from "@/hooks/usePageParams";
import MirrorPackagesCount from "../MirrorPackagesCount";
import MirrorActions from "../MirrorActions";
import LoadingState from "@/components/layout/LoadingState";
import { OperationStatusCell } from "@/features/operations";
import { OperationProvider } from "@/context/operationStatus";
import { TablePagination } from "@/components/layout/TablePagination";
import { AssociatedPublicationsCount } from "@/features/publications";
import classes from "./MirrorsList.module.scss";

interface MirrorsListProps {
  readonly mirrors: Mirror[];
  readonly emptyMsg?: string;
}

const MirrorsList: FC<MirrorsListProps> = ({ mirrors, emptyMsg }) => {
  const { createPageParamsSetter, currentPage, pageSize } = usePageParams();

  const pagedMirrors = useMemo(
    () => mirrors.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [mirrors, currentPage, pageSize],
  );

  const operationNames = useMemo(
    () =>
      pagedMirrors
        .filter((mirror) => mirror.lastOperation)
        .map((mirror) => mirror.lastOperation ?? ""),
    [pagedMirrors],
  );

  const columns = useMemo<Column<Mirror>[]>(
    () => [
      {
        Header: "Mirror name",
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={createPageParamsSetter({
              sidePath: ["view"],
              name: mirror.name,
            })}
          >
            {mirror.displayName}
          </Button>
        ),
      },
      {
        Header: "Status",
        className: `${classes.status} p-table__cell--icon-placeholder`,
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) => (
          <OperationStatusCell
            operationName={mirror.lastOperation}
            type="mirror"
          />
        ),
      },
      {
        Header: "Last update",
        className: classes.datetime,
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) =>
          mirror.lastDownloadDate ? (
            moment(mirror.lastDownloadDate).format(DISPLAY_DATE_TIME_FORMAT)
          ) : (
            <NoData />
          ),
      },
      {
        Header: "Distribution",
        className: classes.distribution,
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) =>
          mirror.distribution ?? <NoData />,
      },
      {
        Header: "Packages",
        className: classes.count,
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) =>
          mirror.name ? (
            <MirrorPackagesCount mirrorName={mirror.name} />
          ) : (
            <NoData />
          ),
      },
      {
        Header: "Publications",
        className: classes.count,
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) =>
          mirror.name ? (
            <AssociatedPublicationsCount sourceName={mirror.name} />
          ) : (
            <NoData />
          ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        accessor: undefined,
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) =>
          mirror.name ? (
            <Suspense fallback={<LoadingState inline />}>
              <MirrorActions
                mirrorDisplayName={mirror.displayName}
                mirrorName={mirror.name}
                operationName={mirror.lastOperation}
              />
            </Suspense>
          ) : (
            <NoData />
          ),
      },
    ],
    [createPageParamsSetter],
  );

  return (
    <OperationProvider operationNames={operationNames}>
      <ResponsiveTable
        columns={columns}
        data={pagedMirrors}
        emptyMsg={
          emptyMsg ?? "No mirrors found according to your search parameters."
        }
        minWidth={1120}
      />
      <TablePagination
        totalItems={mirrors.length}
        currentItemCount={pagedMirrors.length}
        pageSizeLabel="Mirrors per page"
      />
    </OperationProvider>
  );
};

export default MirrorsList;
