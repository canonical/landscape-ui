import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { ScriptsContainer, ScriptsTabs } from "@/features/scripts";
import useEnv from "@/hooks/useEnv";
import type { FC } from "react";

const ScriptsPage: FC = () => {
  const { isSelfHosted } = useEnv();

  return (
    <PageMain>
      <PageHeader title="Scripts" />
      <PageContent>
        {!isSelfHosted ? <ScriptsContainer /> : <ScriptsTabs />}
      </PageContent>
    </PageMain>
  );
};

export default ScriptsPage;
