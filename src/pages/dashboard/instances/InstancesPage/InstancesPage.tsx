import type { FC } from "react";
import { useState } from "react";
import PageMain from "@/components/layout/PageMain";
import PageHeader from "@/components/layout/PageHeader";
import PageContent from "@/components/layout/PageContent";
import InstancesContainer from "@/pages/dashboard/instances/InstancesContainer/InstancesContainer";
import type { Instance } from "@/types/Instance";
import { InstancesPageActions } from "@/features/instances";

const InstancesPage: FC = () => {
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
          setSelectedInstances={(instances) => {
            setSelected(instances);
          }}
        />
      </PageContent>
    </PageMain>
  );
};

export default InstancesPage;
