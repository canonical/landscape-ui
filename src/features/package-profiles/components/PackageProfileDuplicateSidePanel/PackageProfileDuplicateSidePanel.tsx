import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import useGetPagePackageProfile from "../../api/useGetPagePackageProfile";
import PackageProfileDuplicateForm from "./components/PackageProfileDuplicateForm";

const PackageProfileDuplicateSidePanel: FC = () => {
  const { packageProfile, isGettingPackageProfile } =
    useGetPagePackageProfile();

  if (isGettingPackageProfile) {
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
