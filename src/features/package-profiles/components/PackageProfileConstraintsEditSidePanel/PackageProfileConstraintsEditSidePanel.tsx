import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import useGetPagePackageProfile from "../../api/useGetPagePackageProfile";
import PackageProfileConstraintsEditForm from "./components/PackageProfileConstraintsEditForm";

const PackageProfileConstraintsEditSidePanel: FC = () => {
  const { packageProfile, isGettingPackageProfile } =
    useGetPagePackageProfile();

  if (isGettingPackageProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>
        Change &quot;{packageProfile.title}&quot; profile&apos;s constraints
      </SidePanel.Header>
      <SidePanel.Content>
        <PackageProfileConstraintsEditForm profile={packageProfile} />
      </SidePanel.Content>
    </>
  );
};

export default PackageProfileConstraintsEditSidePanel;
