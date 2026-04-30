import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { Mirror } from "@canonical/landscape-openapi";
import { Button, Spinner } from "@canonical/react-components";
import moment from "moment";
import { Suspense, useMemo, type FC } from "react";
import type { CellProps, Column } from "react-table";
import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import MirrorPublicationsLink from "../MirrorPublicationsLink";
import NoData from "@/components/layout/NoData";
import usePageParams from "@/hooks/usePageParams";
import MirrorPackagesCount from "../MirrorPackagesCount";
import MirrorActions from "../MirrorActions";

interface MirrorsListProps {
  readonly mirrors: Mirror[];
  readonly emptyMsg?: string;
}

const MirrorsList: FC<MirrorsListProps> = ({ mirrors, emptyMsg }) => {
  const { createPageParamsSetter } = usePageParams();

  const columns = useMemo<Column<Mirror>[]>(
    () => [
      {
        Header: "Mirror name",
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
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
        Header: "Distribution",
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) =>
          mirror.distribution,
      },
      {
        Header: "Last update",
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) =>
          mirror.lastDownloadDate ? (
            moment(mirror.lastDownloadDate).format(DISPLAY_DATE_TIME_FORMAT)
          ) : (
            <NoData />
          ),
      },
      {
        Header: "Packages",
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) =>
          mirror.name !== undefined ? (
            <MirrorPackagesCount mirrorName={mirror.name} />
          ) : (
            <NoData />
          ),
      },
      {
        Header: "Publications",
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) =>
          mirror.name !== undefined ? (
            <Suspense fallback={<Spinner />}>
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
          mirror.name !== undefined ? (
            <Suspense fallback={<Spinner />}>
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
    [createPageParamsSetter],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={mirrors}
      emptyMsg={
        emptyMsg ?? "No mirrors found according to your search parameters."
      }
    />
  );
};

export default MirrorsList;
