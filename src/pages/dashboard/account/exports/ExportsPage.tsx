import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import { ExportsContainer, ExportDetailsSidePanel } from "@/features/exports";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";

const ExportsPage: FC = () => {
  useSetDynamicFilterValidation("sidePath", ["view"]);
  const { sidePath, lastSidePathSegment, popSidePathUntilClear } =
    usePageParams();

  return (
    <PageMain>
      <PageHeader title="Exports" />
      <PageContent>
        <ExportsContainer />
      </PageContent>
      <SidePanel isOpen={sidePath.length > 0} onClose={popSidePathUntilClear}>
        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <ExportDetailsSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default ExportsPage;
