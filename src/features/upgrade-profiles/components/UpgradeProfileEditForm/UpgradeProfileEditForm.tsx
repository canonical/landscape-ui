import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import SingleUpgradeProfileForm from "../SingleUpgradeProfileForm";
import type { UpgradeProfileSidePanelComponentProps } from "../UpgradeProfileSidePanel";
import UpgradeProfileSidePanel from "../UpgradeProfileSidePanel";

interface UpgradeProfileEditFormProps {
  readonly hasBackButton?: boolean;
}

const Component: FC<
  UpgradeProfileEditFormProps & UpgradeProfileSidePanelComponentProps
> = ({ hasBackButton, upgradeProfile }) => (
  <>
    <SidePanel.Header>
      Edit &quot;{upgradeProfile.title}&quot; profile
    </SidePanel.Header>
    <SidePanel.Content>
      <SingleUpgradeProfileForm
        action="edit"
        profile={upgradeProfile}
        hasBackButton={hasBackButton}
      />
      ;
    </SidePanel.Content>
  </>
);

const UpgradeProfileEditForm: FC<UpgradeProfileEditFormProps> = (props) => (
  <UpgradeProfileSidePanel
    Component={(componentProps) => <Component {...props} {...componentProps} />}
  />
);

export default UpgradeProfileEditForm;
