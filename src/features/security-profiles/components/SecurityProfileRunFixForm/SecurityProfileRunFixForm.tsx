import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import Flow from "@/components/layout/Flow";
import Menu from "@/components/layout/Menu";
import { Form } from "@canonical/react-components";
import type { ComponentProps, FC, SyntheticEvent } from "react";
import type { SecurityProfile } from "../../types";

interface SecurityProfileRunFixFormProps
  extends Pick<
    ComponentProps<typeof SidePanelFormButtons>,
    "hasBackButton" | "onBackButtonPress"
  > {
  readonly profile: SecurityProfile;
  readonly onSubmit: () => Promise<void>;
}

const SecurityProfileRunFixForm: FC<SecurityProfileRunFixFormProps> = ({
  profile,
  onSubmit,
}) => {
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <Form
      style={{
        display: "flex",
        flexDirection: "column",
      }}
      onSubmit={handleSubmit}
    >
      <p>
        Running this profile will apply remediation fixes to the associated
        instances, restart them, and generate an audit. Proceed to execute the
        run manually.
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
            description: "To complete the fixes, instances must be restarted.",
            iconName: "restart",
            children: (
              <Menu>
                <Menu.Row>
                  <Menu.Row.Item
                    label="Delivery time"
                    size={12}
                    value={
                      profile.restart_deliver_delay === 0
                        ? "As soon as possible"
                        : "Scheduled"
                    }
                  />
                </Menu.Row>

                <Menu.Row>
                  <Menu.Row.Item
                    label="Randomize delivery over a time window"
                    size={12}
                    value={
                      profile.restart_deliver_delay
                        ? `${profile.restart_deliver_delay_window} minutes`
                        : "No"
                    }
                  />
                </Menu.Row>
              </Menu>
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
      />
    </Form>
  );
};

export default SecurityProfileRunFixForm;
