import LoadingState from "@/components/layout/LoadingState";
import { LocalSidePanelBody } from "@/components/layout/LocalSidePanel";
import usePageParams from "@/hooks/usePageParams";
import { useState, type FC } from "react";
import { usePackageProfiles } from "../../hooks";
import PackageProfileConstraintsAddForm from "../PackageProfileConstraintsAddForm";
import PackageProfileConstraintsEditForm from "../PackageProfileConstraintsEditForm";

const PackageProfileConstraintsSidePanel: FC = () => {
  const { packageProfile: packageProfileName } = usePageParams();

  const { getPackageProfilesQuery } = usePackageProfiles();

  const [action, setAction] = useState<"add" | "edit">("edit");

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

  switch (action) {
    case "edit":
      return (
        <LocalSidePanelBody
          title={`Change "${packageProfile.title}" profile's constraints`}
        >
          <PackageProfileConstraintsEditForm
            profile={packageProfile}
            openAddForm={() => {
              setAction("add");
            }}
          />
        </LocalSidePanelBody>
      );

    case "add":
      return (
        <LocalSidePanelBody
          title={`Add package constraints to "${packageProfile.title}" profile`}
        >
          <PackageProfileConstraintsAddForm
            profile={packageProfile}
            handleConstraintsEdit={() => {
              setAction("edit");
            }}
          />
        </LocalSidePanelBody>
      );
  }
};

export default PackageProfileConstraintsSidePanel;
