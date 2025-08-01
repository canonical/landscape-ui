import LocalSidePanel, {
  LocalSidePanelBody,
} from "@/components/layout/LocalSidePanel";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
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
        <LocalSidePanel close={close}>
          <LocalSidePanelBody title="Add reboot profile">
            <RebootProfilesForm action="add" />
          </LocalSidePanelBody>
        </LocalSidePanel>
      )}

      {action === "duplicate" && (
        <LocalSidePanel close={close}>
          <RebootProfilesSidePanel
            action="duplicate"
            rebootProfileId={rebootProfile}
          />
        </LocalSidePanel>
      )}

      {action === "edit" && (
        <LocalSidePanel close={close}>
          <RebootProfilesSidePanel
            action="edit"
            rebootProfileId={rebootProfile}
          />
        </LocalSidePanel>
      )}

      {action === "view" && (
        <LocalSidePanel close={close} size="medium">
          <RebootProfileDetails />
        </LocalSidePanel>
      )}
    </PageMain>
  );
};

export default RebootProfilesPage;
