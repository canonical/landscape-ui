import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import usePackageProfileSidePanel from "../../hooks/usePackageProfileSidePanel";
import PackageProfileConstraintsEditForm from "./components/PackageProfileConstraintsEditForm";

const PackageProfileConstraintsEditSidePanel: FC = () => {
  const { packageProfile } = usePackageProfileSidePanel();

  if (!packageProfile) {
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
