import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import Flow from "@/components/layout/Flow";
import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { pluralize } from "@/utils/_helpers";
import { Form } from "@canonical/react-components";
import type { FC, SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import { useRunSecurityProfile } from "../../api";
import useGetPageSecurityProfile from "../../api/useGetPageSecurityProfile";
import { getNotificationMessage } from "../../helpers";
import { ROUTES } from "@/libs/routes";

const SecurityProfileRunFixSidePanel: FC = () => {
  const debug = useDebug();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const { sidePath, popSidePath, createPageParamsSetter } = usePageParams();

  const { securityProfile: profile, isGettingSecurityProfile } =
    useGetPageSecurityProfile();
  const { runSecurityProfile } = useRunSecurityProfile();

  if (isGettingSecurityProfile) {
    return <SidePanel.LoadingState />;
  }

  const closeSidePanel = createPageParamsSetter({ sidePath: [], profile: "" });

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const { data: activity } = await runSecurityProfile({
        id: profile.id,
      });

      closeSidePanel();

      const message = getNotificationMessage(profile.mode);

      notify.success({
        title: `You have successfully initiated run of the ${profile.title} security profile`,
        message,
        actions: [
          {
            label: "View details",
            onClick: () => {
              navigate(
                ROUTES.activities.root({
                  query: `parent-id:${activity.id}`,
                }),
              );
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
        Run &quot;{profile.title}&quot; profile
      </SidePanel.Header>
      <SidePanel.Content>
        <Form
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={handleSubmit}
        >
          <p>
            Running this profile will apply remediation fixes to the associated
            instances, restart them, and generate an audit. Proceed to execute
            the run manually.
          </p>

          <Flow
            cards={[
              {
                header: "Apply fixes",
                description:
                  "Security profile will attempt to apply remediations before the next audit, helping maintain instances' compliance with the security profile.",
                iconName: "open-terminal",
              },
              {
                header: "Restart instances",
                description:
                  "To complete the fixes, instances must be restarted.",
                iconName: "restart",
                children: (
                  <InfoGrid>
                    <InfoGrid.Item
                      label="Delivery time"
                      large
                      value={
                        profile.restart_deliver_delay === 0
                          ? "As soon as possible"
                          : `Delayed by ${profile.restart_deliver_delay} ${pluralize(
                              profile.restart_deliver_delay,
                              "hour",
                            )}`
                      }
                    />

                    <InfoGrid.Item
                      label="Randomize delivery over a time window"
                      large
                      value={
                        profile.restart_deliver_delay_window
                          ? `Yes, over ${profile.restart_deliver_delay_window} ${pluralize(
                              profile.restart_deliver_delay_window,
                              "minute",
                            )}`
                          : "No"
                      }
                    />
                  </InfoGrid>
                ),
              },
              {
                header: "Generate an audit",
                description:
                  "Security profile will generate an audit for all instances associated, aggregated in the audit view to show pass/fail results and allow detailed inspection.",
                iconName: "file-blank",
              },
            ].filter(
              (card) =>
                profile.mode.includes("restart") ||
                card.header !== "Restart instances",
            )}
          />
          <SidePanelFormButtons
            submitButtonDisabled={false}
            submitButtonText="Run"
            onCancel={closeSidePanel}
            hasBackButton={sidePath.length > 1}
            onBackButtonPress={popSidePath}
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

export default SecurityProfileRunFixSidePanel;
