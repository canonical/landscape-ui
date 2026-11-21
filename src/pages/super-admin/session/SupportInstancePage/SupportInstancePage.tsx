import PageMain from "@/components/layout/PageMain";
import { SupportInstanceContainer } from "@/features/super-admin";
import type { FC } from "react";
import { useParams } from "react-router";

const SupportInstancePage: FC = () => {
  const {
    name = "",
    instanceId,
    childInstanceId,
  } = useParams<{
    name: string;
    instanceId: string;
    childInstanceId: string;
  }>();

  return (
    <PageMain>
      <SupportInstanceContainer
        name={name}
        instanceId={instanceId}
        childInstanceId={childInstanceId}
      />
    </PageMain>
  );
};

export default SupportInstancePage;
