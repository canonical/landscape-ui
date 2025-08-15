import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import RebootProfilesForm from "../RebootProfilesForm";
import type { RebootProfileSidePanelComponentProps } from "../RebootProfileSidePanel";
import RebootProfileSidePanel from "../RebootProfileSidePanel";

interface RebootProfileDuplicateFormProps {
  readonly hasBackButton?: boolean;
}

const Component: FC<
  RebootProfileDuplicateFormProps & RebootProfileSidePanelComponentProps
> = ({ hasBackButton, rebootProfile }) => (
  <>
    <SidePanel.Header>Duplicate {rebootProfile.title}</SidePanel.Header>
    <SidePanel.Content>
      <RebootProfilesForm
        action="duplicate"
        profile={rebootProfile}
        hasBackButton={hasBackButton}
      />
    </SidePanel.Content>
  </>
);

const RebootProfileDuplicateForm: FC<RebootProfileDuplicateFormProps> = (
  props,
) => (
  <RebootProfileSidePanel
    Component={(componentProps) => <Component {...props} {...componentProps} />}
  />
);

export default RebootProfileDuplicateForm;
