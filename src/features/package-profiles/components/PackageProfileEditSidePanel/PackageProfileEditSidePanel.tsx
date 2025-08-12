import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { usePackageProfiles } from "../../hooks";
import PackageProfileEditForm from "../PackageProfileEditForm";

interface PackageProfileEditSidePanelProps {
  readonly hasBackButton?: boolean;
}

const PackageProfileEditSidePanel: FC<PackageProfileEditSidePanelProps> = ({
  hasBackButton,
}) => {
  const { packageProfile: packageProfileName } = usePageParams();

  const { getPackageProfilesQuery } = usePackageProfiles();

  const {
    data: getPackageProfilesQueryResponse,
    isPending: isPendingPackageProfiles,
    error: packageProfilesError,
  } = getPackageProfilesQuery(
    { names: [packageProfileName as string] },
    { enabled: !!packageProfileName },
  );

  if (isPendingPackageProfiles) {
    return <SidePanel.LoadingState />;
  }

  if (packageProfilesError) {
    throw packageProfilesError;
  }

  const [packageProfile] = getPackageProfilesQueryResponse.data.result;

  return (
    <SidePanel.Body title={`Edit ${packageProfile.title}`}>
      <PackageProfileEditForm
        hasBackButton={hasBackButton}
        profile={packageProfile}
      />
    </SidePanel.Body>
  );
};

export default PackageProfileEditSidePanel;
