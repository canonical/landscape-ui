import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import RemovalProfileSidePanel from "../RemovalProfileSidePanel";
import type { RemovalProfileSidePanelComponentProps } from "../RemovalProfileSidePanel/RemovalProfileSidePanel";
import SingleRemovalProfileForm from "../SingleRemovalProfileForm";

interface RemovalProfileEditFormProps {
  readonly hasBackButton?: boolean;
}

const Component: FC<
  RemovalProfileEditFormProps & RemovalProfileSidePanelComponentProps
> = ({ hasBackButton, removalProfile }) => (
  <>
    <SidePanel.Header>
      Edit &quot;{removalProfile.title}&quot; profile
    </SidePanel.Header>

    <SidePanel.Content>
      <SingleRemovalProfileForm
        action="edit"
        profile={removalProfile}
        hasBackButton={hasBackButton}
      />
      ;
    </SidePanel.Content>
  </>
);

const RemovalProfileEditForm: FC<RemovalProfileEditFormProps> = (props) => (
  <RemovalProfileSidePanel
    Component={(componentProps) => <Component {...props} {...componentProps} />}
  />
);

export default RemovalProfileEditForm;
