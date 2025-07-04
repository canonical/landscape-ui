// import PageContent from "@/components/layout/PageContent";
// import PageHeader from "@/components/layout/PageHeader";
// import PageMain from "@/components/layout/PageMain";
// import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
// import { InstancesPageActions } from "@/features/instances";
// import useInstances from "@/hooks/useInstances";
// import usePageParams from "@/hooks/usePageParams";
// import useSelection from "@/hooks/useSelection";
// import InstancesContainer from "@/pages/dashboard/instances/InstancesContainer/InstancesContainer";
// import type { Instance } from "@/types/Instance";
// import { type FC } from "react";
// import { getQuery } from "./helpers";

import { ModularTable } from "@canonical/react-components";
import type { Instance } from "@landscape/types";
import {
  HeaderWithSearch,
  PageContent,
  PageHeader,
  PageMain,
} from "@landscape/ui";
import { useMemo, type FC } from "react";
import type { CellProps, Column } from "react-table";
import { instances } from "./mocks";
import { getStatusCellIconAndLabel } from "./helpers";
import { Link } from "react-router";
import { usePageParams } from "@landscape/hooks";

const InstancesPage: FC = () => {
  const { search } = usePageParams();

  // const { currentPage, pageSize, groupBy, ...filters } = usePageParams();

  // const { getInstancesQuery } = useInstances();

  // const { data: getInstancesQueryResult, isLoading: isGettingInstances } =
  //   getInstancesQuery({
  //     query: getQuery(filters),
  //     root_only: groupBy === "parent",
  //     archived_only: filters.status === "archived",
  //     with_alerts: true,
  //     with_upgrades: DETAILED_UPGRADES_VIEW_ENABLED,
  //     limit: pageSize,
  //     offset: (currentPage - 1) * pageSize,
  //   });

  // const instances = getInstancesQueryResult?.data.results ?? [];

  // const {
  //   selectedItems: selectedInstances,
  //   setSelectedItems: setSelectedInstances,
  // } = useSelection<Instance>(instances, isGettingInstances);

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        accessor: "title",
        Header: "name",
        Cell: ({ row }: CellProps<Instance>) => (
          <Link to={`/instances/${row.original.id}`}>{row.original.title}</Link>
        ),
      },
      {
        accessor: "status",
        Header: "Status",
        Cell: ({ row: { original } }: CellProps<Instance>) => {
          const { label } = getStatusCellIconAndLabel(original);
          return label;
        },
        getCellIcon: ({ row: { original } }: CellProps<Instance>) => {
          const { icon } = getStatusCellIconAndLabel(original);
          return icon;
        },
      },
    ],
    [],
  );

  const filteredInstances = search
    ? instances.filter((instance) =>
        instance.title.toLowerCase().includes(search.toLowerCase()),
      )
    : instances;

  return (
    <PageMain>
      <PageHeader title="Instances" sticky />
      <PageContent>
        <HeaderWithSearch />
        <ModularTable data={filteredInstances} columns={columns} />
      </PageContent>
    </PageMain>
  );
};

export default InstancesPage;
