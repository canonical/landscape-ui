import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import AccessGroupHeader from "../AccessGroupHeader";
import AccessGroupList from "../AccessGroupList";
import { Button } from "@canonical/react-components";
import useSidePanel from "@/hooks/useSidePanel";

const NewAccessGroupForm = lazy(() => import("../NewAccessGroupForm"));

const AccessGroupsContainer: FC = () => {
  const { getAccessGroupQuery } = useRoles();
  const { setSidePanelContent } = useSidePanel();

  const { data: accessGroupResponse, isPending: isLoadingAccessGroups } =
    getAccessGroupQuery();

  const accessGroups = accessGroupResponse?.data || [];

  const handleAddAccessGroup = () => {
    setSidePanelContent(
      "Add access group",
      <Suspense fallback={<LoadingState />}>
        <NewAccessGroupForm />
      </Suspense>,
    );
  };

  return (
    <>
      {isLoadingAccessGroups && <LoadingState />}
      {!isLoadingAccessGroups && accessGroups.length === 0 && (
        <EmptyState
          title="No access groups found"
          icon="copy"
          body="You haven't added any access groups yet."
          link={{
            href: "https://ubuntu.com/landscape/docs/access-groups",
            text: "How to manage access groups in Landscape",
          }}
          cta={[
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
      )}
      {!isLoadingAccessGroups && accessGroups.length > 0 && (
        <>
          <AccessGroupHeader />
          <AccessGroupList accessGroups={accessGroups} />
        </>
      )}
    </>
  );
};

export default AccessGroupsContainer;
