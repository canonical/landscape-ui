import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel/SidePanel";

const MirrorDetails: FC = () => {
  return (
    <>
      <SidePanel.Header>[mirror_name]</SidePanel.Header>
      <SidePanel.Content />
    </>
  );
};

export default MirrorDetails;
