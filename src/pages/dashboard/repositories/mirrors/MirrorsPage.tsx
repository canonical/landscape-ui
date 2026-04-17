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

const NewSeriesForm = lazy(async () =>
  import("@/features/mirrors").then((module) => ({
    default: module.NewSeriesForm,
  })),
);

const MirrorDetails = lazy(async () =>
  import("@/features/mirrors").then((module) => ({
    default: module.MirrorDetails,
  })),
);

const MirrorsPage: FC = () => {
  const { search, sidePath, lastSidePathSegment, createPageParamsSetter } =
    usePageParams();

  useSetDynamicFilterValidation("sidePath", ["add", "edit", "publish", "view"]);

  const { data } = useListMirrors({ filter: search, pageSize: 20 });

  const openAddMirrorForm = createPageParamsSetter({
    sidePath: ["add"],
    profile: "",
  });

  const buttons = [
    <Button key="add" appearance="positive" onClick={openAddMirrorForm} hasIcon>
      <Icon name={ICONS.plus} light />
      <span>Add mirror</span>
    </Button>,
  ];

  const { actions, children, hasTable } = data.data.mirrors?.length
    ? {
        actions: buttons,
        children: (
          <>
            <HeaderWithSearch />
            <MirrorsList mirrors={data.data.mirrors} />
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
      <SidePanel
        onClose={createPageParamsSetter({ sidePath: [], profile: "" })}
        isOpen={!!sidePath.length}
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <NewSeriesForm />
          </SidePanel.Suspense>
        )}
        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="add">
            <NewSeriesForm />
          </SidePanel.Suspense>
        )}
        {lastSidePathSegment === "publish" && (
          <SidePanel.Suspense key="add">
            <NewSeriesForm />
          </SidePanel.Suspense>
        )}
        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="add">
            <MirrorDetails />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default MirrorsPage;
