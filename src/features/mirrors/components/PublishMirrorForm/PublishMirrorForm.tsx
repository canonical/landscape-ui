import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel/SidePanel";

const PublishMirrorForm: FC = () => {
  return (
    <>
      <SidePanel.Header>Publish [mirror_name]</SidePanel.Header>
      <SidePanel.Content />
    </>
  );
};

export default PublishMirrorForm;
