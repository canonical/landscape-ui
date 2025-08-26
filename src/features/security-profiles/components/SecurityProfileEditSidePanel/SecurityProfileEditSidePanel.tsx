import SidePanel from "@/components/layout/SidePanel";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useUpdateSecurityProfile } from "../../api";
import useGetPageSecurityProfile from "../../api/useGetPageSecurityProfile";
import { getInitialValues } from "../../helpers";
import SecurityProfileForm from "../SecurityProfileForm";

const SecurityProfileEditSidePanel: FC = () => {
  const { notify } = useNotify();
  const { sidePath, popSidePath } = usePageParams();

  const { securityProfile, isGettingSecurityProfile } =
    useGetPageSecurityProfile();
  const { updateSecurityProfile, isSecurityProfileUpdating } =
    useUpdateSecurityProfile();

  if (isGettingSecurityProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Edit {securityProfile.title}</SidePanel.Header>
      <SidePanel.Content>
        <SecurityProfileForm
          benchmarkStepDisabled
          confirmationStepDescription="To save your changes, you need to run the profile."
          getConfirmationStepDisabled={(values) => values.mode == "audit"}
          initialValues={getInitialValues(securityProfile)}
          mutate={async (values) => {
            updateSecurityProfile({
              id: securityProfile.id,
              access_group: values.access_group,
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
              title: `You have successfully saved changes for ${values.title} security profile.`,
              message: "Your changes have been saved successfully.",
            });
          }}
          submitButtonText="Save changes"
          submitting={isSecurityProfileUpdating}
          hasBackButton={sidePath.length > 1}
          onBackButtonPress={popSidePath}
        />
      </SidePanel.Content>
    </>
  );
};

export default SecurityProfileEditSidePanel;
