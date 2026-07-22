import type { FC } from "react";
import { lazy, Suspense } from "react";
import useRoles from "@/hooks/useRoles";
import { Button } from "@canonical/react-components";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import EmptyState from "@/components/layout/EmptyState";
import RoleList from "@/pages/dashboard/settings/roles/RoleList";
import { ADMINISTRATORS_DOCUMENTATION_URL } from "@/constants";

const AddRoleForm = lazy(
  () => import("@/pages/dashboard/settings/roles/AddRoleForm"),
);

const RolesContainer: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const { getRolesQuery } = useRoles();

  const { data: getRolesQueryResult, isLoading: getRolesQueryLoading } =
    getRolesQuery();

  return (
    <>
      {getRolesQueryLoading && <LoadingState />}
      {!getRolesQueryLoading &&
        (!getRolesQueryResult || !getRolesQueryResult.data.length) && (
          <EmptyState
            title="No roles found"
            body="You haven’t added any roles yet."
            link={{
              href: ADMINISTRATORS_DOCUMENTATION_URL,
              text: "How to manage administrators in Landscape",
            }}
            cta={[
              <Button
                type="button"
                key="add"
                appearance="positive"
                onClick={() => {
                  setSidePanelContent(
                    "Add role",
                    <Suspense fallback={<LoadingState />}>
                      <AddRoleForm />
                    </Suspense>,
                  );
                }}
              >
                Add role
              </Button>,
            ]}
          />
        )}
      {!getRolesQueryLoading &&
        getRolesQueryResult &&
        getRolesQueryResult.data.length > 0 && (
          <RoleList roleList={getRolesQueryResult.data} />
        )}
    </>
  );
};

export default RolesContainer;
