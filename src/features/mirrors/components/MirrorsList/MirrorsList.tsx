import ResponsiveTable from "@/components/layout/ResponsiveTable";
import {
  DEFAULT_POLLING_INTERVAL,
  DISPLAY_DATE_TIME_FORMAT,
} from "@/constants";
import type { Mirror } from "@canonical/landscape-openapi";
import { Button } from "@canonical/react-components";
import moment from "moment";
import { Suspense, useMemo, type FC } from "react";
import type { CellProps, Column } from "react-table";
import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import MirrorPublicationsLink from "../MirrorPublicationsLink";
import NoData from "@/components/layout/NoData";
import usePageParams from "@/hooks/usePageParams";
import MirrorPackagesCount from "../MirrorPackagesCount";
import MirrorActions from "../MirrorActions";
import LoadingState from "@/components/layout/LoadingState";
import {
  useBatchGetOperations,
  OperationStatusCell,
  getOperationStatusIcon,
} from "@/features/operations";
import { TablePagination } from "@/components/layout/TablePagination";

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

  const operationNames = mirrors
    .filter((mirror) => mirror.lastOperation)
    .map((mirror) => mirror.lastOperation ?? "");

  const { operations, isGettingOperations } = useBatchGetOperations(
    operationNames,
    {
      refetchInterval: ({ state }) =>
        Object.values(state.data ?? {}).some((operation) => !operation.done)
          ? DEFAULT_POLLING_INTERVAL
          : false,
    },
  );

  const columns = useMemo<Column<Mirror>[]>(
    () => [
      {
        Header: "Mirror name",
        className: "large-cell",
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
        className: "large-cell",
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) => {
          const operation = operations[mirror.lastOperation ?? ""];
          return (
            <OperationStatusCell
              isGettingOperation={isGettingOperations}
              operationMetadata={operation?.metadata}
              type="mirror"
            />
          );
        },
        getCellIcon: ({ row: { original: mirror } }: CellProps<Mirror>) => {
          // eslint-disable-next-line react/prop-types
          const operation = operations[mirror.lastOperation ?? ""];
          return getOperationStatusIcon(operation?.metadata?.status);
        },
      },
      {
        Header: "Last update",
        className: "medium-cell",
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) =>
          mirror.lastDownloadDate ? (
            moment(mirror.lastDownloadDate).format(DISPLAY_DATE_TIME_FORMAT)
          ) : (
            <NoData />
          ),
      },
      {
        Header: "Distribution",
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) =>
          mirror.distribution ?? <NoData />,
      },
      {
        Header: "Packages",
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) =>
          mirror.name ? (
            <MirrorPackagesCount mirrorName={mirror.name} />
          ) : (
            <NoData />
          ),
      },
      {
        Header: "Publications",
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) =>
          mirror.name ? (
            <Suspense fallback={<LoadingState inline />}>
              <MirrorPublicationsLink mirrorName={mirror.name} />
            </Suspense>
          ) : (
            <NoData />
          ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        accessor: undefined,
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) => {
          const operation = operations[mirror.lastOperation ?? ""];
          return mirror.name ? (
            <Suspense fallback={<LoadingState inline />}>
              <MirrorActions
                mirrorDisplayName={mirror.displayName}
                mirrorName={mirror.name}
                inProgress={!!operation && !operation.done}
              />
            </Suspense>
          ) : (
            <NoData />
          );
        },
      },
    ],
    [createPageParamsSetter, isGettingOperations, operations],
  );

  return (
    <>
      <ResponsiveTable
        columns={columns}
        data={pagedMirrors}
        emptyMsg={
          emptyMsg ?? "No mirrors found according to your search parameters."
        }
        minWidth={1150}
      />
      <TablePagination
        totalItems={mirrors.length}
        currentItemCount={pagedMirrors.length}
        pageSizeLabel="Mirrors per page"
      />
    </>
  );
};

export default MirrorsList;
