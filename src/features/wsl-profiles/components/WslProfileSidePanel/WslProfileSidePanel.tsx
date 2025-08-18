import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetWslProfile } from "../../api";
import type { WslProfile } from "../../types";

export interface WslProfileSidePanelComponentProps {
  wslProfile: WslProfile;
}

interface WslProfileSidePanelProps {
  readonly Component: FC<WslProfileSidePanelComponentProps>;
}

const WslProfileSidePanel: FC<WslProfileSidePanelProps> = ({ Component }) => {
  const { wslProfile: wslProfileName } = usePageParams();

  const { wslProfile, isGettingWslProfile, wslProfileError } = useGetWslProfile(
    { profile_name: wslProfileName },
  );

  if (isGettingWslProfile) {
    return <SidePanel.LoadingState />;
  } else if (!wslProfile) {
    throw wslProfileError;
  } else {
    return <Component wslProfile={wslProfile} />;
  }
};

export default WslProfileSidePanel;
