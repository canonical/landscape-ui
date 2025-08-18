import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useGetWslProfile } from "../../api";
import type { WslProfile } from "../../types";

export interface WslProfileSidePanelComponentProps {
  wslProfile: WslProfile;
  disableQuery: () => void;
  enableQuery: () => void;
}

interface WslProfileSidePanelProps {
  readonly Component: FC<WslProfileSidePanelComponentProps>;
}

const WslProfileSidePanel: FC<WslProfileSidePanelProps> = ({ Component }) => {
  const { wslProfile: wslProfileName } = usePageParams();

  const {
    value: queryEnabled,
    setTrue: enableQuery,
    setFalse: disableQuery,
  } = useBoolean(true);

  const { wslProfile, isGettingWslProfile, wslProfileError } = useGetWslProfile(
    { profile_name: wslProfileName },
    { enabled: queryEnabled },
  );

  if (isGettingWslProfile) {
    return <SidePanel.LoadingState />;
  }

  if (!wslProfile) {
    throw wslProfileError;
  }

  return (
    <Component
      wslProfile={wslProfile}
      disableQuery={disableQuery}
      enableQuery={enableQuery}
    />
  );
};

export default WslProfileSidePanel;
