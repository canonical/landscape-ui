import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import {
  AddPublicationButton,
  AddPublicationForm,
  PublicationDetailsSidePanel,
  PublicationsContainer,
} from "@/features/publications";
import type { FC } from "react";

const PublicationsPage: FC = () => {
  const { sidePath, lastSidePathSegment, createPageParamsSetter } = usePageParams();

  useSetDynamicFilterValidation("sidePath", ["add", "view"]);
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
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <SidePanel.Header>Add publication</SidePanel.Header>
            <AddPublicationForm />
          </SidePanel.Suspense>
        )}
        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <PublicationDetailsSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default PublicationsPage;