import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { AccessGroup } from "@/features/access-groups";
import useRoles from "@/hooks/useRoles";
import { getTitleByName } from "@/utils/_helpers";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";

type AccessGroupRow = AccessGroup & Record<string, unknown>;

/** The entered account's access groups, read-only. */
const SupportAccessGroups: FC = () => {
  const { getAccessGroupQuery } = useRoles();
  const { data, isPending, error } = getAccessGroupQuery();

  const columns = useMemo<Column<AccessGroupRow>[]>(
    () => [
      { accessor: "title", Header: "Title" },
      { accessor: "name", Header: "Name" },
      {
        accessor: "parent",
        Header: "Parent",
        Cell: ({ row: { original } }: CellProps<AccessGroupRow>) =>
          original.parent ? getTitleByName(original.parent, data) : "---",
      },
    ],
    [data],
  );

  if (error) {
    throw error;
  }

  if (isPending) {
    return <LoadingState />;
  }

  return (
    <ResponsiveTable
      columns={columns}
      data={(data?.data ?? []) as AccessGroupRow[]}
      emptyMsg="This account has no access groups."
    />
  );
};

export default SupportAccessGroups;
