import type { FC } from "react";
import { lazy, Suspense } from "react";
import useRoles from "@/hooks/useRoles";
import { Button } from "@canonical/react-components";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import EmptyState from "@/components/layout/EmptyState";
import RoleList from "@/pages/dashboard/settings/roles/RoleList";

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
            body={
              <>
                <p className="u-no-margin--bottom">
                  You haven’t added any roles yet.
                </p>
                <a
                  href="https://ubuntu.com/landscape/docs/administrators"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  How to manage administrators in Landscape
                </a>
              </>
            }
            cta={[
              <Button
                type="button"
                key="add"
                appearance="positive"
                onClick={() =>
                  setSidePanelContent(
                    "Add role",
                    <Suspense fallback={<LoadingState />}>
                      <AddRoleForm />
                    </Suspense>,
                  )
                }
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
