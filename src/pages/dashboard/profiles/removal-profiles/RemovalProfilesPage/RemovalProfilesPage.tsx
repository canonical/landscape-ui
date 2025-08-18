import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import RemovalProfileContainer from "@/pages/dashboard/profiles/removal-profiles/RemovalProfileContainer";
import { Button } from "@canonical/react-components";
import { lazy, type FC } from "react";

const RemovalProfileAddForm = lazy(async () =>
  import("@/features/removal-profiles").then((module) => ({
    default: module.RemovalProfileAddForm,
  })),
);

const RemovalProfileDetails = lazy(async () =>
  import("@/features/removal-profiles").then((module) => ({
    default: module.RemovalProfileDetails,
  })),
);

const RemovalProfileEditForm = lazy(async () =>
  import("@/features/removal-profiles").then((module) => ({
    default: module.RemovalProfileEditForm,
  })),
);

const RemovalProfilesPage: FC = () => {
  const { sidePath, peekSidePath, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("sidePath", ["add", "edit", "view"]);

  const handleCreate = () => {
    setPageParams({ sidePath: ["add"], removalProfile: -1 });
  };

  return (
    <PageMain>
      <PageHeader
        title="Removal profiles"
        actions={[
          <Button
            key="add"
            type="button"
            appearance="positive"
            onClick={handleCreate}
          >
            Add removal profile
          </Button>,
        ]}
      />
      <PageContent>
        <RemovalProfileContainer />
      </PageContent>

      <SidePanel
        isOpen={!!sidePath.length}
        onClose={() => {
          setPageParams({ sidePath: [], rebootProfile: -1 });
        }}
      >
        {peekSidePath() === "add" && (
          <SidePanel.Suspense key="add">
            <RemovalProfileAddForm />
          </SidePanel.Suspense>
        )}

        {peekSidePath() === "edit" && (
          <SidePanel.Suspense key="edit">
            <RemovalProfileEditForm />
          </SidePanel.Suspense>
        )}

        {peekSidePath() === "view" && (
          <SidePanel.Suspense key="view">
            <RemovalProfileDetails />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default RemovalProfilesPage;
