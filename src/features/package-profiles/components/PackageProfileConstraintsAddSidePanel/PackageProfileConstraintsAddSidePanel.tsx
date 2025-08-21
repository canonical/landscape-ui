import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import useGetPagePackageProfile from "../../api/useGetPagePackageProfile";
import PackageProfileConstraintsAddForm from "./components/PackageProfileConstraintsAddForm";

const PackageProfileConstraintsAddSidePanel: FC = () => {
  const { packageProfile, isGettingPackageProfile } =
    useGetPagePackageProfile();

  if (isGettingPackageProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>
        Add package constraints to &quot;${packageProfile.title}&quot; profile
      </SidePanel.Header>
      <SidePanel.Content>
        <PackageProfileConstraintsAddForm profile={packageProfile} />
      </SidePanel.Content>
    </>
  );
};

export default PackageProfileConstraintsAddSidePanel;
