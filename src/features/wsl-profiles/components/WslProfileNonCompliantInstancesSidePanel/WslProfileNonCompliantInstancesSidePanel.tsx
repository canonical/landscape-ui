import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import useGetPageWslProfile from "../../api/useGetPageWslProfile";
import WslProfileNonCompliantInstancesList from "./components/WslProfileNonCompliantInstancesList";

const WslProfileNonCompliantInstancesSidePanel: FC = () => {
  const { wslProfile, isGettingWslProfile } = useGetPageWslProfile();

  if (isGettingWslProfile) {
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
