import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import { AccessGroupContainer } from "@/features/access-groups";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";

const NewAccessGroupForm = lazy(
  () => import("@/features/access-groups/components/NewAccessGroupForm"),
);

const EditAccessGroupSidePanel = lazy(
  () => import("@/features/access-groups/components/EditAccessGroupSidePanel"),
);

const AccessGroupsPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const { sidePath, lastSidePathSegment, popSidePathUntilClear } =
    usePageParams();

  const handleAddAccessGroup = () => {
    setSidePanelContent(
      "Add access group",
      <Suspense fallback={<LoadingState />}>
        <NewAccessGroupForm />
      </Suspense>,
    );
  };

  useSetDynamicFilterValidation("sidePath", ["edit"]);

  return (
    <PageMain>
      <PageHeader
        title="Access groups"
        actions={[
          <Button
            key="add-access-group"
            appearance="positive"
            onClick={handleAddAccessGroup}
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
      </SidePanel>
    </PageMain>
  );
};

export default AccessGroupsPage;
