import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import usePackageProfileSidePanel from "../../hooks/usePackageProfileSidePanel";
import PackageProfileEditForm from "./components/PackageProfileEditForm";

const PackageProfileEditSidePanel: FC = () => {
  const { packageProfile } = usePackageProfileSidePanel();

  if (!packageProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Edit {packageProfile.title}</SidePanel.Header>
      <SidePanel.Content>
        <PackageProfileEditForm packageProfile={packageProfile} />
      </SidePanel.Content>
    </>
  );
};

export default PackageProfileEditSidePanel;
