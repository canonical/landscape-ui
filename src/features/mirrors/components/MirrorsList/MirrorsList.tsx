import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { Mirror } from "@canonical/landscape-openapi";
import { Button } from "@canonical/react-components";
import moment from "moment";
import { useMemo, type FC } from "react";
import type { CellProps, Column } from "react-table";
import ListActions, {
  LIST_ACTIONS_COLUMN_PROPS,
} from "@/components/layout/ListActions";
import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";

interface MirrorsListProps {
  readonly mirrors: Mirror[];
}

const MirrorsList: FC<MirrorsListProps> = ({ mirrors }) => {
  const columns = useMemo<Column<Mirror>[]>(
    () => [
      {
        Header: "Mirror name",
        Cell: ({ row: { original: mirror } }: CellProps<Mirror>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
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
          moment(mirror.lastDownloadDate).format(DISPLAY_DATE_TIME_FORMAT),
      },
      {
        Header: "Packages",
        Cell: () => (
          <StaticLink to={ROUTES.repositories.publications()}>
            publications
          </StaticLink>
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        accessor: undefined,
        Cell: () => (
          <ListActions
            actions={[
              {
                icon: "show",
                label: "View details",
              },
              {
                icon: "edit",
                label: "Edit",
              },
              {
                icon: "restart",
                label: "Update",
              },
              {
                icon: "upload",
                label: "Publish",
              },
            ]}
            destructiveActions={[
              {
                icon: "delete",
                label: "Remove",
              },
            ]}
          />
        ),
      },
    ],
    [],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={mirrors}
      emptyMsg="No mirrors found according to your search parameters."
    />
  );
};

export default MirrorsList;
