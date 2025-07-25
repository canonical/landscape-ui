import LoadingState from "@/components/layout/LoadingState";
import { LocalSidePanelHeader } from "@/components/layout/LocalSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import { SidePanel } from "@canonical/react-components";
import type { FC } from "react";
import { useParams } from "react-router";
import { usePackageProfiles } from "../../hooks";
import PackageProfileConstraintsEditForm from "../PackageProfileConstraintsEditForm";

const PackageProfileConstraintsEditSidePanel: FC = () => {
  const { packageProfileName } = useParams<UrlParams>();

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
      <>
        <LocalSidePanelHeader root=".." />

        <SidePanel.Content>
          <LoadingState />
        </SidePanel.Content>
      </>
    );
  }

  const packageProfile = getPackageProfilesQueryResponse?.data.result[0];

  if (!packageProfile) {
    throw new Error("The package profile could not be found.");
  }

  return (
    <>
      <LocalSidePanelHeader
        root=".."
        title={`Change ${packageProfile.title} package constraints`}
      />

      <SidePanel.Content>
        <PackageProfileConstraintsEditForm profile={packageProfile} />
      </SidePanel.Content>
    </>
  );
};

export default PackageProfileConstraintsEditSidePanel;
