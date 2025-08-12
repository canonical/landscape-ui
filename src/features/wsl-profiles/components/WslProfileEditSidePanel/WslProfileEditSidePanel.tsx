import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetWslProfile } from "../../api";
import WslProfileEditForm from "../WslProfileEditForm";

const WslProfileEditSidePanel: FC = () => {
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
    <SidePanel.Body title={`Edit "${wslProfile.title}" profile`}>
      <WslProfileEditForm profile={wslProfile} />
    </SidePanel.Body>
  );
};

export default WslProfileEditSidePanel;
