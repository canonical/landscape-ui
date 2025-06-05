import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { InstancesPageActions } from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import InstancesContainer from "@/pages/dashboard/instances/InstancesContainer/InstancesContainer";
import type { Instance } from "@/types/Instance";
import type { FC } from "react";
import { useState } from "react";

const InstancesPageBase: FC = () => {
  const [selected, setSelected] = useState<Instance[]>([]);

  return (
    <PageMain>
      <PageHeader
        title="Instances"
        actions={[<InstancesPageActions key="actions" selected={selected} />]}
        sticky
      />
      <PageContent>
        <InstancesContainer
          selectedInstances={selected}
          setSelectedInstances={setSelected}
        />
      </PageContent>
    </PageMain>
  );
};

const InstancesPage: FC = () => {
  const pageParams = usePageParams();

  return <InstancesPageBase key={JSON.stringify(pageParams)} />;
};

export default InstancesPage;
