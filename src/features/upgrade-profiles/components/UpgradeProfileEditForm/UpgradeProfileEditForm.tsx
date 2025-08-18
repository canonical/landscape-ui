import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import SingleUpgradeProfileForm from "../SingleUpgradeProfileForm";
import type { UpgradeProfileSidePanelComponentProps } from "../UpgradeProfileSidePanel";
import UpgradeProfileSidePanel from "../UpgradeProfileSidePanel";

const Component: FC<UpgradeProfileSidePanelComponentProps> = ({
  upgradeProfile,
}) => (
  <>
    <SidePanel.Header>
      Edit &quot;{upgradeProfile.title}&quot; profile
    </SidePanel.Header>
    <SidePanel.Content>
      <SingleUpgradeProfileForm action="edit" profile={upgradeProfile} />;
    </SidePanel.Content>
  </>
);

const UpgradeProfileEditForm: FC = () => (
  <UpgradeProfileSidePanel Component={Component} />
);

export default UpgradeProfileEditForm;
