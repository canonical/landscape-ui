import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import usePackageProfileSidePanel from "../../hooks/usePackageProfileSidePanel";
import PackageProfileDetails from "./components/PackageProfileDetails";

const PackageProfileDetailsSidePanel: FC = () => {
  const { packageProfile } = usePackageProfileSidePanel();

  if (!packageProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>{packageProfile.title}</SidePanel.Header>
      <SidePanel.Content>
        <PackageProfileDetails packageProfile={packageProfile} />
      </SidePanel.Content>
    </>
  );
};

export default PackageProfileDetailsSidePanel;
