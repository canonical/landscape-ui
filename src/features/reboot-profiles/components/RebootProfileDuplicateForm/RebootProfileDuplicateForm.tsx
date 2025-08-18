import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import RebootProfilesForm from "../RebootProfilesForm";
import type { RebootProfileSidePanelComponentProps } from "../RebootProfileSidePanel";
import RebootProfileSidePanel from "../RebootProfileSidePanel";

const Component: FC<RebootProfileSidePanelComponentProps> = ({
  rebootProfile,
}) => (
  <>
    <SidePanel.Header>Duplicate {rebootProfile.title}</SidePanel.Header>
    <SidePanel.Content>
      <RebootProfilesForm action="duplicate" profile={rebootProfile} />
    </SidePanel.Content>
  </>
);

const RebootProfileDuplicateForm: FC = () => (
  <RebootProfileSidePanel Component={Component} />
);

export default RebootProfileDuplicateForm;
