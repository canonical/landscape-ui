import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import usePackageProfileSidePanel from "../../hooks/usePackageProfileSidePanel";
import PackageProfileDuplicateForm from "./components/PackageProfileDuplicateForm";

const PackageProfileDuplicateSidePanel: FC = () => {
  const { packageProfile } = usePackageProfileSidePanel();

  if (!packageProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Duplicate {packageProfile.title}</SidePanel.Header>
      <SidePanel.Content>
        <PackageProfileDuplicateForm profile={packageProfile} />
      </SidePanel.Content>
    </>
  );
};

export default PackageProfileDuplicateSidePanel;
