import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useRemovalProfiles } from "../../hooks";
import SingleRemovalProfileForm from "../SingleRemovalProfileForm";

const RemovalProfileEditSidePanel: FC = () => {
  const { removalProfile: removalProfileId } = usePageParams();

  const { getRemovalProfilesQuery } = useRemovalProfiles();
  const {
    data: getRemovalProfilesQueryResponse,
    isPending: isGettingRemovalProfiles,
    error: removalProfilesError,
  } = getRemovalProfilesQuery();

  if (removalProfilesError) {
    throw removalProfilesError;
  }

  if (isGettingRemovalProfiles) {
    return <SidePanel.LoadingState />;
  }

  const removalProfile = getRemovalProfilesQueryResponse.data.find(
    ({ id }) => id === removalProfileId,
  );

  if (!removalProfile) {
    throw new Error("The removal profile could not be found.");
  }

  return (
    <SidePanel.Body title={`Edit "${removalProfile.title}" profile`}>
      <SingleRemovalProfileForm action="edit" profile={removalProfile} />;
    </SidePanel.Body>
  );
};

export default RemovalProfileEditSidePanel;
