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

const RebootProfileAddSidePanel = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileAddSidePanel,
  })),
);

const RebootProfileDetailsSidePanel = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileDetails,
  })),
);

const RebootProfileDuplicateSidePanel = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileDuplicateSidePanel,
  })),
);

const RebootProfileEditSidePanel = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileEditSidePanel,
  })),
);

const RebootProfilesPage: FC = () => {
  const { action, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("action", ["add", "duplicate", "edit", "view"]);

  const handleAddProfile = () => {
    setPageParams({ action: "add", rebootProfile: -1 });
  };

  const close = () => {
    setPageParams({ action: "", rebootProfile: -1 });
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

      {action === "add" && (
        <SidePanel close={close} key="add">
          <RebootProfileAddSidePanel />
        </SidePanel>
      )}

      {action === "duplicate" && (
        <SidePanel close={close} key="duplicate">
          <RebootProfileDuplicateSidePanel />
        </SidePanel>
      )}

      {action === "edit" && (
        <SidePanel close={close} key="edit">
          <RebootProfileEditSidePanel />
        </SidePanel>
      )}

      {action === "view" && (
        <SidePanel close={close} key="view" size="medium">
          <RebootProfileDetailsSidePanel />
        </SidePanel>
      )}
    </PageMain>
  );
};

export default RebootProfilesPage;
