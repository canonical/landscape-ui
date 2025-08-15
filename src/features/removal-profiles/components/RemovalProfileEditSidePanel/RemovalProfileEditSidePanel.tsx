import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useRemovalProfiles } from "../../hooks";
import SingleRemovalProfileForm from "../SingleRemovalProfileForm";

interface RemovalProfileEditSidePanelProps {
  readonly hasBackButton?: boolean;
}

const RemovalProfileEditSidePanel: FC<RemovalProfileEditSidePanelProps> = ({
  hasBackButton,
}) => {
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
    <>
      <SidePanel.Header>
        Edit &quot;{removalProfile.title}&quot; profile
      </SidePanel.Header>

      <SidePanel.Content>
        <SingleRemovalProfileForm
          action="edit"
          profile={removalProfile}
          hasBackButton={hasBackButton}
        />
        ;
      </SidePanel.Content>
    </>
  );
};

export default RemovalProfileEditSidePanel;
