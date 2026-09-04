import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import { AccessGroupContainer } from "@/features/access-groups";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy } from "react";

const NewAccessGroupForm = lazy(
  () => import("@/features/access-groups/components/NewAccessGroupForm"),
);

const EditAccessGroupSidePanel = lazy(
  () => import("@/features/access-groups/components/EditAccessGroupSidePanel"),
);

const ViewAccessGroupSidePanel = lazy(
  async () =>
    import("@/features/access-groups/components/ViewAccessGroupSidePanel"),
);

const AccessGroupsPage: FC = () => {
  const {
    lastSidePathSegment,
    sidePath,
    popSidePathUntilClear,
    createPageParamsSetter,
  } = usePageParams();

  useSetDynamicFilterValidation("sidePath", ["add", "view", "edit"]);

  return (
    <PageMain>
      <PageHeader
        title="Access groups"
        actions={[
          <Button
            key="add-access-group"
            appearance="positive"
            onClick={createPageParamsSetter({
              sidePath: ["add"],
              name: "",
            })}
            type="button"
            className="u-no-margin--right"
          >
            Add access group
          </Button>,
        ]}
      />
      <PageContent hasTable>
        <AccessGroupContainer />
      </PageContent>

      <SidePanel onClose={popSidePathUntilClear} isOpen={!!sidePath.length}>
        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <EditAccessGroupSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <NewAccessGroupForm />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <ViewAccessGroupSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default AccessGroupsPage;
