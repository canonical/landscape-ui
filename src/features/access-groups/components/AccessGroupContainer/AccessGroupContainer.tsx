import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import AccessGroupHeader from "../AccessGroupHeader";
import AccessGroupList from "../AccessGroupList";
import { Button } from "@canonical/react-components";
import { ACCESS_GROUPS_DOCUMENTATION_URL } from "./constants";

const AccessGroupsContainer: FC = () => {
  const { getAccessGroupQuery } = useRoles();
  const { createPageParamsSetter } = usePageParams();

  const { data: accessGroupResponse, isPending: isLoadingAccessGroups } =
    getAccessGroupQuery();

  const accessGroups = accessGroupResponse?.data || [];

  if (isLoadingAccessGroups) {
    return <LoadingState />;
  }

  if (accessGroups.length === 0) {
    return (
      <EmptyState
        title="No access groups found"
        icon="copy"
        body="You haven't added any access groups yet."
        link={{
          href: ACCESS_GROUPS_DOCUMENTATION_URL,
          text: "How to manage access groups in Landscape",
        }}
        cta={[
          <Button
            key="add-access-group"
            appearance="positive"
            onClick={createPageParamsSetter({ sidePath: ["add"], name: "" })}
            type="button"
            className="u-no-margin--right"
          >
            Add access group
          </Button>,
        ]}
      />
    );
  }

  return (
    <>
      <AccessGroupHeader />
      <AccessGroupList accessGroups={accessGroups} />
    </>
  );
};

export default AccessGroupsContainer;
