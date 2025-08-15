import SidePanel from "@/components/layout/SidePanel";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useAddSecurityProfile, useGetSecurityProfiles } from "../../api";
import { getInitialValues, notifyCreation } from "../../helpers";
import SecurityProfileForm from "../SecurityProfileForm";

interface SecurityProfileDuplicateSidePanelProps {
  readonly hasBackButton?: boolean;
}

const SecurityProfileDuplicateSidePanel: FC<
  SecurityProfileDuplicateSidePanelProps
> = ({ hasBackButton }) => {
  const { notify } = useNotify();
  const { securityProfile: securityProfileId, setPageParams } = usePageParams();

  const { isSecurityProfilesLoading, securityProfiles, securityProfilesError } =
    useGetSecurityProfiles();
  const { addSecurityProfile, isSecurityProfileAdding } =
    useAddSecurityProfile();

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
    <>
      <SidePanel.Header>Duplicate {securityProfile.title}</SidePanel.Header>
      <SidePanel.Content>
        <SecurityProfileForm
          confirmationStepDescription="To duplicate the profile, you need to run it."
          initialValues={{
            ...getInitialValues(securityProfile),
            title: `${securityProfile.title} copy`,
          }}
          mutate={async (values) => {
            addSecurityProfile({
              access_group: values.access_group,
              all_computers: values.all_computers,
              benchmark: values.benchmark,
              mode: values.mode,
              restart_deliver_delay: values.restart_deliver_delay,
              restart_deliver_delay_window: values.restart_deliver_delay_window,
              schedule: values.schedule,
              start_date: values.start_date,
              tags: values.tags,
              tailoring_file: values.tailoring_file,
              title: values.title,
            });
          }}
          onSuccess={(values) => {
            notifyCreation(values, notify);
          }}
          submitButtonText="Duplicate"
          submitting={isSecurityProfileAdding}
          hasBackButton={hasBackButton}
          onBackButtonPress={() => {
            setPageParams({ action: "view" });
          }}
        />
        ;
      </SidePanel.Content>
    </>
  );
};

export default SecurityProfileDuplicateSidePanel;
