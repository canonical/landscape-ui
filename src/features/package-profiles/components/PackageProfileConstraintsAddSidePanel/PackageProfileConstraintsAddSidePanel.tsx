import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import usePackageProfileSidePanel from "../../hooks/usePackageProfileSidePanel";
import PackageProfileConstraintsAddForm from "./components/PackageProfileConstraintsAddForm";

const PackageProfileConstraintsAddSidePanel: FC = () => {
  const { packageProfile } = usePackageProfileSidePanel();

  if (!packageProfile) {
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
