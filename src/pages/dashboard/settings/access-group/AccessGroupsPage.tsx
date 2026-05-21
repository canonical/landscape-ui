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

const AccessGroupsPage: FC = () => {
  useSetDynamicFilterValidation("sidePath", ["add"]);
  const { createSidePathPusher, lastSidePathSegment, popSidePathUntilClear } =
    usePageParams();

  return (
    <PageMain>
      <PageHeader
        title="Access groups"
        actions={[
          <Button
            key="add-access-group"
            appearance="positive"
            onClick={createSidePathPusher("add")}
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

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={lastSidePathSegment === "add"}
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <SidePanel.Header>Add access group</SidePanel.Header>
            <SidePanel.Content>
              <NewAccessGroupForm />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default AccessGroupsPage;
