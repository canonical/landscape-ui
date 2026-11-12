import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { SupportInstances } from "@/features/super-admin";
import type { FC } from "react";
import { useParams } from "react-router";

const SupportInstancesPage: FC = () => {
  const { name = "" } = useParams<{ name: string }>();

  return (
    <PageMain>
      <PageHeader title="Instances" />
      <PageContent hasTable>
        <SupportInstances name={name} />
      </PageContent>
    </PageMain>
  );
};

export default SupportInstancesPage;
