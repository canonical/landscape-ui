import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { ScriptsContainer, ScriptsTabs } from "@/features/scripts";
import useAuth from "@/hooks/useAuth";
import type { FC } from "react";

const ScriptsPage: FC = () => {
  const { isFeatureEnabled } = useAuth();

  return (
    <PageMain>
      <PageHeader title="Scripts" />
      <PageContent>
        {isFeatureEnabled("script-profiles") ? (
          <ScriptsTabs />
        ) : (
          <ScriptsContainer />
        )}
      </PageContent>
    </PageMain>
  );
};

export default ScriptsPage;
