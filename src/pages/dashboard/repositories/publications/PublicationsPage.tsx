import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import {
  AddPublicationButton,
  PublicationDetailsSidePanel,
  PublicationsContainer,
} from "@/features/publications";
import type { FC } from "react";

const PublicationsPage: FC = () => {
  const { sidePath, createPageParamsSetter } = usePageParams();

  useSetDynamicFilterValidation("sidePath", ["view"]);

const PublicationsPage: FC = () => {
  return (
    <PageMain>
      <PageHeader
        title="Publications"
        actions={[<AddPublicationButton key="add-publication-button" />]}
      />
      <PageContent hasTable>
        <PublicationsContainer />
      </PageContent>

      <SidePanel
        isOpen={!!sidePath.length}
        onClose={createPageParamsSetter({ sidePath: [], name: "" })}
      >
        {sidePath.includes("view") && (
          <SidePanel.Suspense key="view">
            <PublicationDetailsSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default PublicationsPage;
