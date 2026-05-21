import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import useRoles from "@/hooks/useRoles";
import RolesContainer from "@/pages/dashboard/settings/roles/RolesContainer";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy } from "react";

const AddRoleForm = lazy(
  () => import("@/pages/dashboard/settings/roles/AddRoleForm"),
);

const EditRoleForm = lazy(
  () => import("@/pages/dashboard/settings/roles/EditRoleForm"),
);

const RolesPage: FC = () => {
  const {
    lastSidePathSegment,
    name,
    popSidePathUntilClear,
    createSidePathPusher,
  } = usePageParams();
  const { getRolesQuery } = useRoles();
  const { data: getRolesQueryResult } = getRolesQuery();

  useSetDynamicFilterValidation("sidePath", ["add", "edit"]);

  const roles = getRolesQueryResult?.data ?? [];
  const editRole = roles.find((r) => r.name === name);

  return (
    <PageMain>
      <PageHeader
        title="Roles"
        actions={[
          <Button
            key="add-role"
            type="button"
            onClick={createSidePathPusher("add")}
            appearance="positive"
          >
            Add role
          </Button>,
        ]}
      />
      <PageContent hasTable>
        <RolesContainer />
      </PageContent>

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={
          lastSidePathSegment === "add" ||
          (lastSidePathSegment === "edit" && !!editRole)
        }
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <SidePanel.Header>Add role</SidePanel.Header>
            <SidePanel.Content>
              <AddRoleForm />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && editRole && (
          <SidePanel.Suspense key="edit">
            <SidePanel.Header>Edit {editRole.name} role</SidePanel.Header>
            <SidePanel.Content>
              <EditRoleForm role={editRole} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default RolesPage;
