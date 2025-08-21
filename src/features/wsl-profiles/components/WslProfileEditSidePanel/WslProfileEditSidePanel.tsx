import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import useGetPageWslProfile from "../../api/useGetPageWslProfile";
import WslProfileEditForm from "./components/WslProfileEditForm";

const WslProfileEditSidePanel: FC = () => {
  const { wslProfile, isGettingWslProfile } = useGetPageWslProfile();

  if (isGettingWslProfile) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>
        Edit &quot;{wslProfile.title}&quot; profile
      </SidePanel.Header>
      <SidePanel.Content>
        <WslProfileEditForm profile={wslProfile} />
      </SidePanel.Content>
    </>
  );
};

export default WslProfileEditSidePanel;
