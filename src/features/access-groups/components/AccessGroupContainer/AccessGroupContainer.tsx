import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import AccessGroupHeader from "../AccessGroupHeader";
import AccessGroupList from "../AccessGroupList";

const AccessGroupsContainer: FC = () => {
  const { getAccessGroupQuery } = useRoles();
  const { createSidePathPusher } = usePageParams();

  const { data: accessGroupResponse, isPending: isLoadingAccessGroups } =
    getAccessGroupQuery();

  const accessGroups = accessGroupResponse?.data || [];

  return (
    <>
      {isLoadingAccessGroups && <LoadingState />}
      {!isLoadingAccessGroups && accessGroups.length === 0 && (
        <EmptyState
          title="No access groups found"
          icon="copy"
          body={
            <>
              <p className="u-no-margin--bottom">
                You haven&#39;t added any access groups yet.
              </p>
              <a
                href="https://ubuntu.com/landscape/docs/access-groups"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                How to manage access groups in Landscape
              </a>
            </>
          }
          cta={[
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
