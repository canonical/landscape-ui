import SidePanel from "@/components/layout/SidePanel";
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
    return <SidePanel.LoadingState />;
  }

  if (packageProfilesError) {
    throw packageProfilesError;
  }

  const [packageProfile] = getPackageProfilesQueryResponse.data.result;

  switch (action) {
    case "edit":
      return (
        <>
          <SidePanel.Header>
            Change &quot;{packageProfile.title}&quot; profile&apos;s constraints
          </SidePanel.Header>

          <SidePanel.Content>
            <PackageProfileConstraintsEditForm
              profile={packageProfile}
              openAddForm={() => {
                setAction("add");
              }}
            />
          </SidePanel.Content>
        </>
      );

    case "add":
      return (
        <>
          <SidePanel.Header>
            Add package constraints to &quot;${packageProfile.title}&quot;
            profile
          </SidePanel.Header>

          <SidePanel.Content>
            <PackageProfileConstraintsAddForm
              profile={packageProfile}
              handleConstraintsEdit={() => {
                setAction("edit");
              }}
            />
          </SidePanel.Content>
        </>
      );
  }
};

export default PackageProfileConstraintsSidePanel;
