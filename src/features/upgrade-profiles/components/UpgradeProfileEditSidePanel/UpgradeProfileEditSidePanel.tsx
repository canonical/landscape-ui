import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useUpgradeProfiles } from "../../hooks";
import SingleUpgradeProfileForm from "../SingleUpgradeProfileForm";

const UpgradeProfileEditSidePanel: FC = () => {
  const { upgradeProfile: upgradeProfileId } = usePageParams();

  const { getUpgradeProfilesQuery } = useUpgradeProfiles();
  const {
    data: getUpgradeProfilesQueryResponse,
    isPending: isGettingUpgradeProfiles,
    error: upgradeProfilesError,
  } = getUpgradeProfilesQuery();

  if (upgradeProfilesError) {
    throw upgradeProfilesError;
  }

  if (isGettingUpgradeProfiles) {
    return <SidePanel.LoadingState />;
  }

  const upgradeProfile = getUpgradeProfilesQueryResponse.data.find(
    ({ id }) => id === upgradeProfileId,
  );

  if (!upgradeProfile) {
    throw new Error("The upgrade profile could not be found.");
  }

  return (
    <SidePanel.Body title={`Edit "${upgradeProfile.title}" profile`}>
      <SingleUpgradeProfileForm action="edit" profile={upgradeProfile} />;
    </SidePanel.Body>
  );
};

export default UpgradeProfileEditSidePanel;
