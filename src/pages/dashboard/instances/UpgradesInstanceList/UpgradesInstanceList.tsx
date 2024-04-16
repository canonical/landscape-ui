import { FC, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CellProps, Column } from "react-table";
import ExpandableTable from "@/components/layout/ExpandableTable";
import { ROOT_PATH } from "@/constants";
import { Instance } from "@/types/Instance";

interface UpgradesInstanceListProps {
  instances: Instance[];
}

const UpgradesInstanceList: FC<UpgradesInstanceListProps> = ({ instances }) => {
  const [limit, setLimit] = useState(5);

  const affectedInstances = useMemo<Instance[]>(
    () => instances.slice(0, limit),
    [instances, limit],
  );

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        accessor: "title",
        Header: "Instance",
        Cell: ({ row }: CellProps<Instance>) => (
          <Link
            className="u-no-margin--bottom u-no-padding--top"
            to={`${ROOT_PATH}instances/${row.original.parent ? `${row.original.parent.id}/${row.original.id}` : row.original.id}`}
            state={{ tab: "packages", filter: "upgrade", selectAll: true }}
          >
            {row.original.title}
          </Link>
        ),
      },
      {
        accessor: "security_upgrades",
        Header: "Security upgrades",
        Cell: ({ row }: CellProps<Instance>) => (
          <>{row.original.upgrades?.security}</>
        ),
      },
      {
        accessor: "upgrades",
        Header: "Regular upgrades",
        Cell: ({ row }: CellProps<Instance>) => (
          <>{row.original.upgrades?.regular}</>
        ),
      },
    ],
    [instances.length],
  );

  return (
    <ExpandableTable
      columns={columns}
      data={affectedInstances}
      limit={limit}
      onLimitChange={() => setLimit((prevState) => prevState + 5)}
      itemNames={{ plural: "instances", singular: "instance" }}
      title="Affected instances"
      totalCount={instances.length}
    />
  );
};

export default UpgradesInstanceList;
