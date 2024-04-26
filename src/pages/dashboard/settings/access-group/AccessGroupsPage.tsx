import { Button } from "@canonical/react-components";
import classNames from "classnames";
import { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageHeader from "@/components/layout/PageHeader";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import AccessGroupList from "./AccessGroupList";
import NewAccessGroupForm from "./NewAccessGroupForm";
import PageMain from "@/components/layout/PageMain";
import PageContent from "@/components/layout/PageContent";

const AccessGroupsPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupResponse, isLoading } = getAccessGroupQuery();

  const accessGroupData = accessGroupResponse?.data ?? [];

  const handleAddAccessGroup = () => {
    setSidePanelContent("Add access group", <NewAccessGroupForm />);
  };

  const AddNewAccessGroupButton = ({ className }: { className?: string }) => (
    <Button
      appearance="positive"
      onClick={handleAddAccessGroup}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      type="button"
      className={classNames("u-no-margin--right", className)}
    >
      Add access group
    </Button>
  );

  return (
    <PageMain>
      <PageHeader
        title="Access groups"
        actions={[
          <AddNewAccessGroupButton key="add-new-access-group-button" />,
        ]}
      />
      <PageContent>
        {isLoading && <LoadingState />}
        {!isLoading && accessGroupData.length === 0 && (
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
            cta={[<AddNewAccessGroupButton key="empty-state-new-button" />]}
          />
        )}
        {!isLoading && accessGroupData.length > 0 && (
          <AccessGroupList accessGroupData={accessGroupData} />
        )}
      </PageContent>
    </PageMain>
  );
};

export default AccessGroupsPage;
