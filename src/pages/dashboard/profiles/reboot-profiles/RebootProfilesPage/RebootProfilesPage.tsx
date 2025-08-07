import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import {
  RebootProfileDetails,
  RebootProfilesContainer,
  RebootProfilesSidePanel,
} from "@/features/reboot-profiles";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy } from "react";

const RebootProfilesForm = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfilesForm,
  })),
);

const RebootProfilesPage: FC = () => {
  const { action, rebootProfile, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("action", ["add", "duplicate", "edit", "view"]);

  const handleAddProfile = () => {
    setPageParams({ action: "add", rebootProfile: null });
  };

  const close = () => {
    setPageParams({ action: "", rebootProfile: null });
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
          <SidePanel.Body title="Add reboot profile">
            <RebootProfilesForm action="add" />
          </SidePanel.Body>
        </SidePanel>
      )}

      {action === "duplicate" && (
        <SidePanel close={close} key="duplicate">
          <RebootProfilesSidePanel
            action="duplicate"
            rebootProfileId={rebootProfile}
          />
        </SidePanel>
      )}

      {action === "edit" && (
        <SidePanel close={close} key="edit">
          <RebootProfilesSidePanel
            action="edit"
            rebootProfileId={rebootProfile}
          />
        </SidePanel>
      )}

      {action === "view" && (
        <SidePanel close={close} key="view" size="medium">
          <RebootProfileDetails />
        </SidePanel>
      )}
    </PageMain>
  );
};

export default RebootProfilesPage;
