import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetWslProfile } from "../../api";
import WslProfileEditForm from "../WslProfileEditForm";

interface WslProfileEditSidePanelProps {
  readonly hasBackButton?: boolean;
}

const WslProfileEditSidePanel: FC<WslProfileEditSidePanelProps> = ({
  hasBackButton,
}) => {
  const { wslProfile: wslProfileName } = usePageParams();

  const { wslProfile, isGettingWslProfile, wslProfileError } = useGetWslProfile(
    { profile_name: wslProfileName },
  );

  if (isGettingWslProfile) {
    return <SidePanel.LoadingState />;
  }

  if (!wslProfile) {
    throw wslProfileError;
  }

  return (
    <>
      <SidePanel.Header>
        Edit &quot;{wslProfile.title}&quot; profile
      </SidePanel.Header>
      <SidePanel.Content>
        <WslProfileEditForm
          profile={wslProfile}
          hasBackButton={hasBackButton}
        />
      </SidePanel.Content>
    </>
  );
};

export default WslProfileEditSidePanel;
