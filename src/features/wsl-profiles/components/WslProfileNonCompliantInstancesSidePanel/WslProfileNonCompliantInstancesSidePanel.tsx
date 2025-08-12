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
    <SidePanel.Body title={`Instances not compliant with ${wslProfile.title}`}>
      <WslProfileNonCompliantInstancesList wslProfile={wslProfile} />
    </SidePanel.Body>
  );
};

export default WslProfileNonCompliantInstancesSidePanel;
