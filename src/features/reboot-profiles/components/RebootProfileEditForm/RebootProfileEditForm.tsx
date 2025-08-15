import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import RebootProfilesForm from "../RebootProfilesForm";
import type { RebootProfileSidePanelComponentProps } from "../RebootProfileSidePanel";
import RebootProfileSidePanel from "../RebootProfileSidePanel";

interface RebootProfileEditFormProps {
  readonly hasBackButton?: boolean;
}

const Component: FC<
  RebootProfileEditFormProps & RebootProfileSidePanelComponentProps
> = ({ hasBackButton, rebootProfile }) => (
  <>
    <SidePanel.Header>Edit {rebootProfile.title}</SidePanel.Header>

    <SidePanel.Content>
      <RebootProfilesForm
        action="edit"
        profile={rebootProfile}
        hasBackButton={hasBackButton}
      />
      ;
    </SidePanel.Content>
  </>
);

const RebootProfileEditForm: FC<RebootProfileEditFormProps> = (props) => (
  <RebootProfileSidePanel
    Component={(componentProps) => <Component {...props} {...componentProps} />}
  />
);

export default RebootProfileEditForm;
