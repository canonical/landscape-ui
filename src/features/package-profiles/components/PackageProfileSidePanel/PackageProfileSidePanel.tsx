import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import { type FC } from "react";
import { useGetPackageProfile } from "../../api";
import type { PackageProfile } from "../../types";

export interface PackageProfileSidePanelComponentProps {
  packageProfile: PackageProfile;
}

interface PackageProfileSidePanelProps {
  readonly Component: FC<PackageProfileSidePanelComponentProps>;
}

const PackageProfileSidePanel: FC<PackageProfileSidePanelProps> = ({
  Component,
}) => {
  const { profile: packageProfileName } = usePageParams();

  const { packageProfile, isGettingPackageProfile, packageProfileError } =
    useGetPackageProfile(packageProfileName);

  if (isGettingPackageProfile) {
    return <SidePanel.LoadingState />;
  }

  if (!packageProfile) {
    throw packageProfileError;
  }

  return <Component packageProfile={packageProfile} />;
};

export default PackageProfileSidePanel;
