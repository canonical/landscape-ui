import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import { type FC } from "react";
import { usePackageProfiles } from "../../hooks";
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
  const { packageProfile: packageProfileName } = usePageParams();

  const { getPackageProfilesQuery } = usePackageProfiles();

  const {
    data: packageProfilesResponse,
    isPending: isPendingPackageProfiles,
    error: packageProfilesError,
  } = getPackageProfilesQuery({ names: [packageProfileName] });

  if (isPendingPackageProfiles) {
    return <SidePanel.LoadingState />;
  } else if (packageProfilesError) {
    throw packageProfilesError;
  } else {
    return (
      <Component packageProfile={packageProfilesResponse.data.result[0]} />
    );
  }
};

export default PackageProfileSidePanel;
