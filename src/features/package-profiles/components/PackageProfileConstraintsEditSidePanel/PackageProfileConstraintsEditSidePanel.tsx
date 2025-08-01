import LoadingState from "@/components/layout/LoadingState";
import { LocalSidePanelBody } from "@/components/layout/LocalSidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { usePackageProfiles } from "../../hooks";
import PackageProfileConstraintsEditForm from "../PackageProfileConstraintsEditForm";

const PackageProfileConstraintsEditSidePanel: FC = () => {
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
    <LocalSidePanelBody
      title={`Change ${packageProfile.title} package constraints`}
    >
      <PackageProfileConstraintsEditForm profile={packageProfile} />
    </LocalSidePanelBody>
  );
};

export default PackageProfileConstraintsEditSidePanel;
