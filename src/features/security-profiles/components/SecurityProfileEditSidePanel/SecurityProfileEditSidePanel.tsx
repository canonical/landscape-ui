import SidePanel from "@/components/layout/SidePanel";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetSecurityProfiles, useUpdateSecurityProfile } from "../../api";
import { getInitialValues } from "../../helpers";
import SecurityProfileForm from "../SecurityProfileForm";

interface SecurityProfileEditSidePanelProps {
  readonly hasBackButton?: boolean;
}

const SecurityProfileEditSidePanel: FC<SecurityProfileEditSidePanelProps> = ({
  hasBackButton,
}) => {
  const { notify } = useNotify();
  const { securityProfile: securityProfileId, setPageParams } = usePageParams();

  const { isSecurityProfilesLoading, securityProfiles, securityProfilesError } =
    useGetSecurityProfiles();
  const { updateSecurityProfile, isSecurityProfileUpdating } =
    useUpdateSecurityProfile();

  if (isSecurityProfilesLoading) {
    return <SidePanel.LoadingState />;
  }

  if (!securityProfiles) {
    throw securityProfilesError;
  }

  const securityProfile = securityProfiles.find(
    ({ id }) => id === securityProfileId,
  );

  if (!securityProfile) {
    throw new Error("The security profile could not be found.");
  }

  return (
    <SidePanel.Body title={`Edit ${securityProfile.title}`}>
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
        hasBackButton={hasBackButton}
        onBackButtonPress={() => {
          setPageParams({ action: "view" });
        }}
      />
      ;
    </SidePanel.Body>
  );
};

export default SecurityProfileEditSidePanel;
