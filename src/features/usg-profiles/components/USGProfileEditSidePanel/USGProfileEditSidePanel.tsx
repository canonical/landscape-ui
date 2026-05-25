import SidePanel from "@/components/layout/SidePanel";
import useNotify from "@/hooks/useNotify";
import type { FC } from "react";
import { useUpdateUsgProfile } from "../../api";
import { useGetPageUsgProfile } from "../../api/useGetPageUsgProfile";
import { getInitialValues } from "../../helpers";
import USGProfileForm from "../USGProfileForm";

const USGProfileEditSidePanel: FC = () => {
  const { notify } = useNotify();

  const { usgProfile, isGettingUsgProfile } = useGetPageUsgProfile();
  const { updateUsgProfile, isUsgProfileUpdating } = useUpdateUsgProfile();

  if (isGettingUsgProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Edit {usgProfile.title}</SidePanel.Header>
      <SidePanel.Content>
        <USGProfileForm
          formMode="edit"
          benchmarkStepDisabled
          confirmationStepDescription="To save your changes, you need to run the profile."
          getConfirmationStepDisabled={(values) => values.mode == "audit"}
          initialValues={getInitialValues(usgProfile)}
          mutate={async (values) => {
            updateUsgProfile({
              id: usgProfile.id,
              all_computers: values.all_computers,
              restart_deliver_delay: values.restart_deliver_delay,
              restart_deliver_delay_window: values.restart_deliver_delay_window,
              schedule: values.schedule,
              tags: values.tags,
              title: values.title,
            });
          }}
          onSuccess={(values) => {
            notify.success({
              title: `You have successfully saved changes for ${values.title} USG profile.`,
              message: "Your changes have been saved successfully.",
            });
          }}
          submitButtonText="Save changes"
          submitting={isUsgProfileUpdating}
        />
      </SidePanel.Content>
    </>
  );
};

export default USGProfileEditSidePanel;
