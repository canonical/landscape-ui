import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel/SidePanel";

const EditMirrorForm: FC = () => {
  return (
    <>
      <SidePanel.Header>Edit [mirror_name]</SidePanel.Header>
      <SidePanel.Content />
    </>
  );
};

export default EditMirrorForm;
