import SidePanel from "@/components/layout/SidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useNavigate } from "react-router";
import { useGetSecurityProfiles, useRunSecurityProfile } from "../../api";
import { getNotificationMessage } from "../../helpers";
import SecurityProfileRunFixForm from "../SecurityProfileRunFixForm";

interface SecurityProfileRunFixSidePanelProps {
  readonly hasBackButton?: boolean;
}

const SecurityProfileRunFixSidePanel: FC<
  SecurityProfileRunFixSidePanelProps
> = ({ hasBackButton }) => {
  const debug = useDebug();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const { securityProfile: securityProfileId, setPageParams } = usePageParams();

  const { isSecurityProfilesLoading, securityProfiles, securityProfilesError } =
    useGetSecurityProfiles();
  const { runSecurityProfile } = useRunSecurityProfile();

  if (isSecurityProfilesLoading) {
    return <SidePanel.LoadingState />;
  }

  if (!securityProfiles) {
    throw securityProfilesError;
  }

  const securityProfile = securityProfiles.find(
    ({ id }) => id === securityProfileId,
  );

  if (!securityProfile) {
    throw new Error("The security profile could not be found.");
  }

  const handleRunSecurityProfile = async () => {
    try {
      const { data: activity } = await runSecurityProfile({
        id: securityProfile.id,
      });

      setPageParams({ action: "", securityProfile: -1 });

      const message = getNotificationMessage(securityProfile.mode);

      notify.success({
        title: `You have successfully initiated run of the ${securityProfile.title} security profile`,
        message,
        actions: [
          {
            label: "View details",
            onClick: () => {
              navigate(`/activities?query=parent-id%3A${activity.id}`);
            },
          },
        ],
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <>
      <SidePanel.Header>
        Run &quot;{securityProfile.title}&quot; profile
      </SidePanel.Header>
      <SidePanel.Content>
        <SecurityProfileRunFixForm
          profile={securityProfile}
          onSubmit={async () => {
            await handleRunSecurityProfile();
          }}
          hasBackButton={hasBackButton}
          onBackButtonPress={() => {
            setPageParams({ action: "view" });
          }}
        />
        ;
      </SidePanel.Content>
    </>
  );
};

export default SecurityProfileRunFixSidePanel;
