import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { ScriptsTabs } from "@/features/scripts";
import type { FC } from "react";

const ScriptsPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Scripts" />
      <PageContent>
        <ScriptsTabs />
      </PageContent>
    </PageMain>
  );
};

export default ScriptsPage;
