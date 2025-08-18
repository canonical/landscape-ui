import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import RemovalProfileSidePanel from "../RemovalProfileSidePanel";
import type { RemovalProfileSidePanelComponentProps } from "../RemovalProfileSidePanel/RemovalProfileSidePanel";
import SingleRemovalProfileForm from "../SingleRemovalProfileForm";

const Component: FC<RemovalProfileSidePanelComponentProps> = ({
  removalProfile,
}) => (
  <>
    <SidePanel.Header>
      Edit &quot;{removalProfile.title}&quot; profile
    </SidePanel.Header>
    <SidePanel.Content>
      <SingleRemovalProfileForm action="edit" profile={removalProfile} />;
    </SidePanel.Content>
  </>
);

const RemovalProfileEditForm: FC = () => (
  <RemovalProfileSidePanel Component={Component} />
);

export default RemovalProfileEditForm;
