import LoadingState from "@/components/layout/LoadingState";
import { LocalSidePanelBody } from "@/components/layout/LocalSidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { usePackageProfiles } from "../../hooks";
import PackageProfileEditForm from "../PackageProfileEditForm";

const PackageProfileEditSidePanel: FC = () => {
  const { packageProfile: packageProfileName } = usePageParams();

  const { getPackageProfilesQuery } = usePackageProfiles();

  const {
    data: getPackageProfilesQueryResponse,
    isPending: isPendingPackageProfiles,
  } = getPackageProfilesQuery(
    { names: [packageProfileName as string] },
    { enabled: !!packageProfileName },
  );

  if (isPendingPackageProfiles) {
    return (
      <LocalSidePanelBody>
        <LoadingState />
      </LocalSidePanelBody>
    );
  }

  const packageProfile = getPackageProfilesQueryResponse?.data.result[0];

  if (!packageProfile) {
    throw new Error("The package profile could not be found.");
  }

  return (
    <LocalSidePanelBody title={`Edit ${packageProfile.title}`}>
      <PackageProfileEditForm profile={packageProfile} />
    </LocalSidePanelBody>
  );
};

export default PackageProfileEditSidePanel;
