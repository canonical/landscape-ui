import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
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

const POLL_INTERVAL = 2000;

interface MirrorsListProps {
  readonly mirrors: Mirror[];
  readonly emptyMsg?: string;
}

const MirrorsList: FC<MirrorsListProps> = ({ mirrors, emptyMsg }) => {
  const { createPageParamsSetter } = usePageParams();

  const operationNames = mirrors
    .filter((mirror) => mirror.lastOperation)
    .map((mirror) => mirror.lastOperation ?? "");

  const { operations: operations, isGettingOperations } = useBatchGetOperations(
    operationNames,
    {
      refetchInterval: ({ state }) =>
        Object.values(state.data ?? {}).some((operation) => !operation.done)
          ? POLL_INTERVAL
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
              operation={operation}
            />
          );
        },
        getCellIcon: ({ row: { original: mirror } }: CellProps<Mirror>) => {
          // eslint-disable-next-line react/prop-types
          const operation = operations[mirror.lastOperation ?? ""];
          return getOperationStatusIcon(operation);
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
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) =>
          mirror.name ? (
            <Suspense fallback={<LoadingState inline />}>
              <MirrorActions
                mirrorDisplayName={mirror.displayName}
                mirrorName={mirror.name}
              />
            </Suspense>
          ) : (
            <NoData />
          ),
      },
    ],
    [createPageParamsSetter, isGettingOperations, operations],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={mirrors}
      emptyMsg={
        emptyMsg ?? "No mirrors found according to your search parameters."
      }
      minWidth={1150}
    />
  );
};

export default MirrorsList;
