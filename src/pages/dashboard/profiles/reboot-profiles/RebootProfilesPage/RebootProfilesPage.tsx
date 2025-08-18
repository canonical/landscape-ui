import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import { RebootProfilesContainer } from "@/features/reboot-profiles";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy } from "react";

const RebootProfileAddForm = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileAddForm,
  })),
);

const RebootProfileDetails = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileDetails,
  })),
);

const RebootProfileDuplicateForm = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileDuplicateForm,
  })),
);

const RebootProfileEditForm = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileEditForm,
  })),
);

const RebootProfilesPage: FC = () => {
  const { sidePath, peekSidePath, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("sidePath", [
    "add",
    "duplicate",
    "edit",
    "view",
  ]);

  const handleAddProfile = () => {
    setPageParams({ sidePath: ["add"], rebootProfile: -1 });
  };

  return (
    <PageMain>
      <PageHeader
        title="Reboot profiles"
        actions={[
          <Button
            key="new-key-button"
            appearance="positive"
            onClick={handleAddProfile}
            type="button"
          >
            Add reboot profile
          </Button>,
        ]}
      />
      <PageContent>
        <RebootProfilesContainer />
      </PageContent>

      <SidePanel
        onClose={() => {
          setPageParams({ sidePath: [], rebootProfile: -1 });
        }}
        key="add"
        isOpen={!!sidePath.length}
      >
        {peekSidePath() === "add" && (
          <SidePanel.Suspense key="add">
            <RebootProfileAddForm />
          </SidePanel.Suspense>
        )}

        {peekSidePath() === "duplicate" && (
          <SidePanel.Suspense key="duplicate">
            <RebootProfileDuplicateForm />
          </SidePanel.Suspense>
        )}

        {peekSidePath() === "edit" && (
          <SidePanel.Suspense key="edit">
            <RebootProfileEditForm />
          </SidePanel.Suspense>
        )}

        {peekSidePath() === "view" && (
          <SidePanel.Suspense key="view">
            <RebootProfileDetails />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default RebootProfilesPage;
