import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import RebootProfilesForm from "../RebootProfilesForm";
import type { RebootProfileSidePanelComponentProps } from "../RebootProfileSidePanel";
import RebootProfileSidePanel from "../RebootProfileSidePanel";

const Component: FC<RebootProfileSidePanelComponentProps> = ({
  rebootProfile,
}) => (
  <>
    <SidePanel.Header>Edit {rebootProfile.title}</SidePanel.Header>
    <SidePanel.Content>
      <RebootProfilesForm action="edit" profile={rebootProfile} />;
    </SidePanel.Content>
  </>
);

const RebootProfileEditForm: FC = () => (
  <RebootProfileSidePanel Component={Component} />
);

export default RebootProfileEditForm;
