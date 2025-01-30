import type { FC } from "react";
import { lazy, Suspense } from "react";
import PageMain from "@/components/layout/PageMain";
import PageHeader from "@/components/layout/PageHeader";
import PageContent from "@/components/layout/PageContent";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import RolesContainer from "@/pages/dashboard/settings/roles/RolesContainer";
import LoadingState from "@/components/layout/LoadingState";

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
      <PageContent>
        <RolesContainer />
      </PageContent>
    </PageMain>
  );
};

export default RolesPage;
