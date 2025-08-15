import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetWslProfile } from "../../api";
import WslProfileNonCompliantInstancesList from "../WslProfileNonCompliantInstancesList";

const WslProfileNonCompliantInstancesSidePanel: FC = () => {
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
        Instances not compliant with {wslProfile.title}
      </SidePanel.Header>
      <SidePanel.Content>
        <WslProfileNonCompliantInstancesList wslProfile={wslProfile} />
      </SidePanel.Content>
    </>
  );
};

export default WslProfileNonCompliantInstancesSidePanel;
