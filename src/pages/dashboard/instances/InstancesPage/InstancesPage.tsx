import PageMain from "@/components/layout/PageMain";
import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import useInstances from "@/hooks/useInstances";
import usePageParams from "@/hooks/usePageParams";
import InstancesContainer from "@/pages/dashboard/instances/InstancesContainer/InstancesContainer";
import type { FC } from "react";
import { getQuery } from "./helpers";

const InstancesPage: FC = () => {
  const { currentPage, pageSize, groupBy, ...filters } = usePageParams();
  const { getInstancesQuery } = useInstances();

  const { data: getInstancesQueryResult, isLoading: getInstancesQueryLoading } =
    getInstancesQuery({
      query: getQuery(filters),
      root_only: groupBy === "parent",
      archived_only: filters.status === "archived",
      with_alerts: true,
      with_upgrades: DETAILED_UPGRADES_VIEW_ENABLED,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

  const instances = getInstancesQueryResult?.data.results ?? [];

  return (
    <PageMain>
      <InstancesContainer
        instanceCount={getInstancesQueryResult?.data.count}
        instances={instances}
        isGettingInstances={getInstancesQueryLoading}
      />
    </PageMain>
  );
};

export default InstancesPage;
