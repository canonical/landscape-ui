import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import { usePackageProfiles } from "../../hooks";
import type { PackageProfile } from "../../types";

export interface PackageProfileSidePanelComponentProps {
  packageProfile: PackageProfile;
  disableQuery: () => void;
  enableQuery: () => void;
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
    value: queryEnabled,
    setTrue: enableQuery,
    setFalse: disableQuery,
  } = useBoolean(true);

  const {
    data: packageProfilesResponse,
    isPending: isPendingPackageProfiles,
    error: packageProfilesError,
  } = getPackageProfilesQuery(
    { names: [packageProfileName] },
    { enabled: queryEnabled },
  );

  if (isPendingPackageProfiles) {
    return <SidePanel.LoadingState />;
  }

  if (packageProfilesError) {
    throw packageProfilesError;
  }

  return (
    <Component
      packageProfile={packageProfilesResponse.data.result[0]}
      disableQuery={disableQuery}
      enableQuery={enableQuery}
    />
  );
};

export default PackageProfileSidePanel;
