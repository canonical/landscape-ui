import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import EmptyState from "@/components/layout/EmptyState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import { useListMirrors } from "@/features/mirrors";
import { MirrorsList } from "@/features/mirrors";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { Button, Icon, ICONS } from "@canonical/react-components";
import { lazy, type FC } from "react";

const EditMirrorForm = lazy(
  async () => import("@/features/mirrors/components/EditMirrorForm"),
);

const AddMirrorForm = lazy(
  async () => import("@/features/mirrors/components/AddMirrorForm"),
);

const MirrorDetails = lazy(
  async () => import("@/features/mirrors/components/MirrorDetails"),
);

const PublishMirrorForm = lazy(
  async () => import("@/features/mirrors/components/PublishMirrorForm"),
);

const MirrorsPage: FC = () => {
  const {
    search,
    sidePath,
    lastSidePathSegment,
    popSidePathUntilClear,
    createPageParamsSetter,
  } = usePageParams();

  useSetDynamicFilterValidation("sidePath", ["add", "edit", "publish", "view"]);

  const { data } = useListMirrors({
    filter: search ? `display_name=${JSON.stringify(`${search}*`)}` : undefined,
    pageSize: 20,
  });

  const openAddMirrorForm = createPageParamsSetter({
    sidePath: ["add"],
    name: "",
  });

  const buttons = [
    <Button key="add" appearance="positive" onClick={openAddMirrorForm} hasIcon>
      <Icon name={ICONS.plus} light />
      <span>Add mirror</span>
    </Button>,
  ];

  const hasMirrors = !!data.data.mirrors?.length;
  const isSearchActive = !!search;

  const { actions, children, hasTable } =
    hasMirrors || isSearchActive
      ? {
          actions: buttons,
          children: (
            <>
              <HeaderWithSearch />
              <MirrorsList
                mirrors={data.data.mirrors ?? []}
                emptyMsg={`No mirrors found with the search: "${search}"`}
              />
            </>
          ),
          hasTable: true,
        }
      : {
          children: (
            <EmptyState
              title="You don't have any mirrors yet."
              body={
                <>
                  <p>This feature allows you to mirror Debian repositories.</p>
                </>
              }
              cta={buttons}
            />
          ),
        };

  return (
    <PageMain>
      <PageHeader title="Mirrors" actions={actions} />
      <PageContent hasTable={hasTable}>{children}</PageContent>
      <SidePanel onClose={popSidePathUntilClear} isOpen={!!sidePath.length}>
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <AddMirrorForm />
          </SidePanel.Suspense>
        )}
        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <EditMirrorForm />
          </SidePanel.Suspense>
        )}
        {lastSidePathSegment === "publish" && (
          <SidePanel.Suspense key="publish">
            <PublishMirrorForm />
          </SidePanel.Suspense>
        )}
        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <MirrorDetails />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default MirrorsPage;
