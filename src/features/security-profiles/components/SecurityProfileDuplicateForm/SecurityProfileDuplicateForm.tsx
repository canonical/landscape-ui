import SidePanel from "@/components/layout/SidePanel";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useAddSecurityProfile } from "../../api";
import { getInitialValues, notifyCreation } from "../../helpers";
import SecurityProfileForm from "../SecurityProfileForm";
import type { SecurityProfileSidePanelComponentProps } from "../SecurityProfileSidePanel";
import SecurityProfileSidePanel from "../SecurityProfileSidePanel";

interface SecurityProfileDuplicateFormProps {
  readonly hasBackButton?: boolean;
}

const Component: FC<
  SecurityProfileDuplicateFormProps & SecurityProfileSidePanelComponentProps
> = ({ hasBackButton, securityProfile }) => {
  const { notify } = useNotify();
  const { setPageParams } = usePageParams();

  const { addSecurityProfile, isSecurityProfileAdding } =
    useAddSecurityProfile();

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

const SecurityProfileDuplicateForm: FC<SecurityProfileDuplicateFormProps> = (
  props,
) => (
  <SecurityProfileSidePanel
    Component={(componentProps) => <Component {...props} {...componentProps} />}
  />
);

export default SecurityProfileDuplicateForm;
