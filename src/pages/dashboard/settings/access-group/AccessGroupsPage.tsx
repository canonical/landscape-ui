import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { AccessGroupContainer } from "@/features/access-groups";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import { FC, lazy, Suspense } from "react";
import classes from "./AccessGroupsPage.module.scss";

const NewAccessGroupForm = lazy(() =>
  import("@/features/access-groups").then((module) => ({
    default: module.NewAccessGroupForm,
  })),
);

const AccessGroupsPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleAddAccessGroup = () => {
    setSidePanelContent(
      "Add access group",
      <Suspense fallback={<LoadingState />}>
        <NewAccessGroupForm />
      </Suspense>,
    );
  };

  return (
    <PageMain>
      <PageHeader
        className={classes.header}
        title="Access groups"
        actions={[
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
      <PageContent>
        <AccessGroupContainer />
      </PageContent>
    </PageMain>
  );
};

export default AccessGroupsPage;
