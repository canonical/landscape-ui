import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import { PublicationsContainer } from "@/features/publications";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { lazy, type FC } from "react";

const AddPublicationForm = lazy(async () =>
  import("@/features/publications").then((module) => ({
    default: module.AddPublicationForm,
  })),
);

const PublicationDetailsSidePanel = lazy(async () =>
  import("@/features/publications").then((module) => ({
    default: module.PublicationDetailsSidePanel,
  })),
);

const AddPublicationTargetForm = lazy(async () =>
  import("@/features/publication-targets").then((module) => ({
    default: module.AddPublicationTargetForm,
  })),
);

const PublicationsPage: FC = () => {
  const { sidePath, lastSidePathSegment, createPageParamsSetter } =
    usePageParams();

  useSetDynamicFilterValidation("sidePath", ["add", "add-target", "view"]);
  return (
    <PageMain>
      <PublicationsContainer />

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
        {lastSidePathSegment === "add-target" && (
          <SidePanel.Suspense key="add-target">
            <SidePanel.Header>Add publication target</SidePanel.Header>
            <AddPublicationTargetForm />
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
