import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import EmptyState from "@/components/layout/EmptyState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import {
  PublicationTargetAddButton,
  PublicationTargetList,
  TargetDetails,
  useGetPublicationTargets,
} from "@/features/publication-targets";
import { lazy, type FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { DEBARCHIVE_DOCUMENTATION_URL } from "@/features/repositories";

const AddPublicationTargetForm = lazy(
  async () =>
    import("@/features/publication-targets/components/AddPublicationTargetForm"),
);

const EditTargetForm = lazy(
  async () =>
    import("@/features/publication-targets/components/EditTargetForm"),
);

const PublicationTargetsPage: FC = () => {
  const { search, lastSidePathSegment, name, popSidePathUntilClear } = usePageParams();
  const { publicationTargets, count, isGettingPublicationTargets } =
    useGetPublicationTargets({
      search,
    });

  useSetDynamicFilterValidation("sidePath", ["view", "add", "edit"]);

  if (isGettingPublicationTargets) {
    return (
      <PageMain>
        <PageHeader title="Publication targets" />
        <PageContent>
          <LoadingState />
        </PageContent>
      </PageMain>
    );
  }

  const viewTarget = publicationTargets.find(
    (t) => t.publicationTargetId === name,
  );

  const addButton = <PublicationTargetAddButton key="add" />;

  const { actions, children, hasTable } = count || search
    ? {
        actions: [addButton],
        children: (
          <>
            <HeaderWithSearch />
            <PublicationTargetList targets={publicationTargets} />
          </>
        ),
        hasTable: true as const,
      }
    : {
        actions: undefined,
        children: (
          <EmptyState
            title="You don’t have any publication targets yet"
            body="On this page you will find all publication targets that you create to publish mirrors to."
            link={{
              href: DEBARCHIVE_DOCUMENTATION_URL,
              text: "Learn more about repository mirroring",
            }}
            cta={[addButton]}
          />
        ),
        hasTable: undefined,
      };

  return (
    <PageMain>
      <PageHeader title="Publication targets" actions={actions} />
      <PageContent hasTable={hasTable}>{children}</PageContent>

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={
          lastSidePathSegment === "add" ||
          (!!lastSidePathSegment && !!viewTarget)
        }
        size="small"
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <SidePanel.Header>Add publication target</SidePanel.Header>
            <SidePanel.Content>
              <AddPublicationTargetForm />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && viewTarget && (
          <SidePanel.Suspense key="view">
            <SidePanel.Header>{viewTarget.displayName}</SidePanel.Header>
            <SidePanel.Content>
              <TargetDetails target={viewTarget} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && viewTarget && (
          <SidePanel.Suspense key="edit">
            <SidePanel.Header>Edit {viewTarget.displayName}</SidePanel.Header>
            <SidePanel.Content>
              <EditTargetForm target={viewTarget} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default PublicationTargetsPage;
