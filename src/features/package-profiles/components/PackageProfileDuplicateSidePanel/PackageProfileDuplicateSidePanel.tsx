import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { usePackageProfiles } from "../../hooks";
import PackageProfileDuplicateForm from "../PackageProfileDuplicateForm";

interface PackageProfileDuplicateSidePanelProps {
  readonly hasBackButton?: boolean;
}

const PackageProfileDuplicateSidePanel: FC<
  PackageProfileDuplicateSidePanelProps
> = ({ hasBackButton }) => {
  const { packageProfile: packageProfileName } = usePageParams();

  const { getPackageProfilesQuery } = usePackageProfiles();

  const {
    data: getPackageProfilesQueryResponse,
    isPending: isLoadingPackageProfiles,
    error: packageProfilesError,
  } = getPackageProfilesQuery({ names: [packageProfileName] });

  if (isLoadingPackageProfiles) {
    return <SidePanel.LoadingState />;
  }

  if (packageProfilesError) {
    throw packageProfilesError;
  }

  const [packageProfile] = getPackageProfilesQueryResponse.data.result;

  return (
    <SidePanel.Body title={`Duplicate ${packageProfile.title}`}>
      <PackageProfileDuplicateForm
        hasBackButton={hasBackButton}
        profile={packageProfile}
      />
    </SidePanel.Body>
  );
};

export default PackageProfileDuplicateSidePanel;
