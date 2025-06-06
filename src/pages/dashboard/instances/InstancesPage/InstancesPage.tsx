import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { InstancesPageActions } from "@/features/instances";
import InstancesContainer from "@/pages/dashboard/instances/InstancesContainer/InstancesContainer";
import type { Instance } from "@/types/Instance";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const InstancesPage: FC = () => {
  const [selectedInstances, setSelectedInstances] = useState<Instance[]>([]);
  const [searchParams] = useSearchParams();
  const searchKey = searchParams.toString();

  useEffect(() => {
    if (selectedInstances.length) {
      setSelectedInstances([]);
    }
  }, [searchKey]);

  return (
    <PageMain>
      <PageHeader
        title="Instances"
        actions={[
          <InstancesPageActions
            key="actions"
            selectedInstances={selectedInstances}
          />,
        ]}
        sticky
      />
      <PageContent>
        <InstancesContainer
          selectedInstances={selectedInstances}
          setSelectedInstances={setSelectedInstances}
        />
      </PageContent>
    </PageMain>
  );
};

export default InstancesPage;
