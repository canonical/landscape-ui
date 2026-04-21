import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import {
  PublicationTargetAddButton,
  PublicationTargetContainer,
  TargetDetails,
  useGetPublicationTargets,
} from "@/features/publication-targets";
import { lazy, type FC } from "react";

const AddPublicationTargetForm = lazy(async () =>
  import("@/features/publication-targets").then((module) => ({
    default: module.AddPublicationTargetForm,
  })),
);

const EditTargetForm = lazy(async () =>
  import("@/features/publication-targets").then((module) => ({
    default: module.EditTargetForm,
  })),
);

const PublicationTargetsPage: FC = () => {
  const { lastSidePathSegment, createPageParamsSetter, name } =
    usePageParams();
  const { publicationTargets } = useGetPublicationTargets();

  useSetDynamicFilterValidation("sidePath", ["view", "add", "edit"]);

  const viewTarget = publicationTargets.find((t) => t.publicationTargetId === name);

  return (
    <PageMain>
      <PageHeader
        title="Publication targets"
        actions={[<PublicationTargetAddButton key="add" />]}
      />
      <PageContent hasTable>
        <PublicationTargetContainer />
      </PageContent>

      <SidePanel
        onClose={createPageParamsSetter({ sidePath: [], name: "" })}
        isOpen={!!lastSidePathSegment}
        size="small"
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <SidePanel.Header>Add publication target</SidePanel.Header>
            <AddPublicationTargetForm />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && viewTarget && (
          <SidePanel.Suspense key="view">
            <SidePanel.Header>{viewTarget.displayName}</SidePanel.Header>
            <TargetDetails target={viewTarget} />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && viewTarget && (
          <SidePanel.Suspense key="edit">
            <SidePanel.Header>Edit {viewTarget.displayName ?? viewTarget.name}</SidePanel.Header>
            <EditTargetForm target={viewTarget} />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default PublicationTargetsPage;
