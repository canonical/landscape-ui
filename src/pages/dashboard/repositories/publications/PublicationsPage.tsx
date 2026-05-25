import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import { PublicationsContainer } from "@/features/publications";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { lazy, type FC } from "react";

const AddPublicationForm = lazy(
  async () => import("@/features/publications/components/AddPublicationForm"),
);

const PublicationDetailsSidePanel = lazy(
  async () =>
    import("@/features/publications/components/PublicationDetailsSidePanel"),
);

const PublicationsPage: FC = () => {
  const { sidePath, lastSidePathSegment, popSidePathUntilClear } =
    usePageParams();

  useSetDynamicFilterValidation("sidePath", ["add", "add-target", "view"]);
  return (
    <PageMain>
      <PublicationsContainer />

      <SidePanel isOpen={!!sidePath.length} onClose={popSidePathUntilClear}>
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <SidePanel.Header>Add publication</SidePanel.Header>
            <SidePanel.Content>
              <AddPublicationForm />
            </SidePanel.Content>
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
