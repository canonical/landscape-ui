import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import type { WslProfile } from "../../types";
import WslProfileNonCompliantInstancesList from "../WslProfileNonCompliantInstancesList";

interface WslProfileNonCompliantInstancesSidePanelProps {
  readonly wslProfile: WslProfile | undefined;
}

const WslProfileNonCompliantInstancesSidePanel: FC<
  WslProfileNonCompliantInstancesSidePanelProps
> = ({ wslProfile }) => {
  if (!wslProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>
        Instances not compliant with {wslProfile.title}
      </SidePanel.Header>
      <SidePanel.Content>
        <WslProfileNonCompliantInstancesList wslProfile={wslProfile} />
      </SidePanel.Content>
    </>
  );
};

export default WslProfileNonCompliantInstancesSidePanel;
