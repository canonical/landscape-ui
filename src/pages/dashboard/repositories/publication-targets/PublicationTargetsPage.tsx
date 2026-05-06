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
  const { lastSidePathSegment, name, popSidePathUntilClear } = usePageParams();
  const { publicationTargets, count, isGettingPublicationTargets } =
    useGetPublicationTargets();

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

  const { actions, children, hasTable } = count
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
            title="You don't have any publication targets yet"
            body={
              <>
                <p className="u-no-margin--bottom">
                  On this page you will find all publication targets that you
                  create to publish mirrors to.
                </p>
                <a
                  href="https://documentation.ubuntu.com/landscape/explanation/features/repository-mirroring"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  Learn more about repository mirroring
                </a>
              </>
            }
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
            <SidePanel.Header>
              Edit {viewTarget.displayName ?? viewTarget.name}
            </SidePanel.Header>
            <EditTargetForm target={viewTarget} />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default PublicationTargetsPage;
