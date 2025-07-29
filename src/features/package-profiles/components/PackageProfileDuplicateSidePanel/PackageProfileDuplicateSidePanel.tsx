import LoadingState from "@/components/layout/LoadingState";
import { LocalSidePanelBody } from "@/components/layout/LocalSidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { usePackageProfiles } from "../../hooks";
import PackageProfileDuplicateForm from "../PackageProfileDuplicateForm";

const PackageProfileDuplicateSidePanel: FC = () => {
  const { packageProfile: packageProfileName } = usePageParams();

  const { getPackageProfilesQuery } = usePackageProfiles();

  const {
    data: getPackageProfilesQueryResponse,
    isPending: isLoadingPackageProfiles,
    error: packageProfilesError,
  } = getPackageProfilesQuery({ names: [packageProfileName] });

  if (isLoadingPackageProfiles) {
    return (
      <LocalSidePanelBody>
        <LoadingState />
      </LocalSidePanelBody>
    );
  }

  if (packageProfilesError) {
    throw packageProfilesError;
  }

  const [packageProfile] = getPackageProfilesQueryResponse.data.result;

  return (
    <LocalSidePanelBody title={`Duplicate ${packageProfile.title}`}>
      <PackageProfileDuplicateForm profile={packageProfile} />
    </LocalSidePanelBody>
  );
};

export default PackageProfileDuplicateSidePanel;
