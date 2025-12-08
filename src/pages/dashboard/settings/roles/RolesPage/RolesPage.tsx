import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import useSidePanel from "@/hooks/useSidePanel";
import RolesContainer from "@/pages/dashboard/settings/roles/RolesContainer";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";

const AddRoleForm = lazy(
  () => import("@/pages/dashboard/settings/roles/AddRoleForm"),
);

const RolesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleAddRole = () => {
    setSidePanelContent(
      "Add Role",
      <Suspense fallback={<LoadingState />}>
        <AddRoleForm />
      </Suspense>,
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="Roles"
        actions={[
          <Button
            key="add-role"
            type="button"
            onClick={handleAddRole}
            appearance="positive"
          >
            Add role
          </Button>,
        ]}
      />
      <PageContent hasTable>
        <RolesContainer />
      </PageContent>
    </PageMain>
  );
};

export default RolesPage;
