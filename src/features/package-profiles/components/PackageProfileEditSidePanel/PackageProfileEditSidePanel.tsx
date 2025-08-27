import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import useGetPagePackageProfile from "../../api/useGetPagePackageProfile";
import PackageProfileEditForm from "./components/PackageProfileEditForm";

const PackageProfileEditSidePanel: FC = () => {
  const { packageProfile, isGettingPackageProfile } =
    useGetPagePackageProfile();

  if (isGettingPackageProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Edit {packageProfile.title}</SidePanel.Header>
      <SidePanel.Content>
        <PackageProfileEditForm profile={packageProfile} />
      </SidePanel.Content>
    </>
  );
};

export default PackageProfileEditSidePanel;
