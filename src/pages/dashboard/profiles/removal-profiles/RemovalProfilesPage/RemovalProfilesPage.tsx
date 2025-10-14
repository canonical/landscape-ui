import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import RemovalProfileContainer from "@/pages/dashboard/profiles/removal-profiles/RemovalProfileContainer";
import { Button } from "@canonical/react-components";
import { lazy, type FC } from "react";

const RemovalProfileAddSidePanel = lazy(async () =>
  import("@/features/removal-profiles").then((module) => ({
    default: module.RemovalProfileAddSidePanel,
  })),
);

const RemovalProfileDetailsSidePanel = lazy(async () =>
  import("@/features/removal-profiles").then((module) => ({
    default: module.RemovalProfileDetailsSidePanel,
  })),
);

const RemovalProfileEditSidePanel = lazy(async () =>
  import("@/features/removal-profiles").then((module) => ({
    default: module.RemovalProfileEditSidePanel,
  })),
);

const RemovalProfilesPage: FC = () => {
  const { sidePath, lastSidePathSegment, createPageParamsSetter } =
    usePageParams();

  useSetDynamicFilterValidation("sidePath", ["add", "edit", "view"]);

  const handleCreate = createPageParamsSetter({
    sidePath: ["add"],
    profile: "",
  });

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
        onClose={createPageParamsSetter({ sidePath: [], profile: "" })}
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <RemovalProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <RemovalProfileEditSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <RemovalProfileDetailsSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default RemovalProfilesPage;
