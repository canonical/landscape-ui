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

const ViewLogsSidePanel = lazy(
  async () => import("@/features/operations/components/ViewLogsSidePanel"),
);

const PublicationsPage: FC = () => {
  const { sidePath, lastSidePathSegment, popSidePathUntilClear } =
    usePageParams();

  useSetDynamicFilterValidation("sidePath", ["add", "view", "logs"]);

  return (
    <PageMain>
      <PublicationsContainer />

      <SidePanel
        isOpen={!!sidePath.length}
        onClose={popSidePathUntilClear}
        size={lastSidePathSegment === "logs" ? "medium" : "small"}
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <AddPublicationForm />
          </SidePanel.Suspense>
        )}
        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <PublicationDetailsSidePanel />
          </SidePanel.Suspense>
        )}
        {lastSidePathSegment === "logs" && (
          <SidePanel.Suspense key="logs">
            <ViewLogsSidePanel resourceType="publications" />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default PublicationsPage;
