import Flow from "@/components/layout/Flow";
import InfoItem from "@/components/layout/InfoItem";
import { Form, Row } from "@canonical/react-components";
import type { FC, SyntheticEvent } from "react";
import type { SecurityProfile } from "../../types";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";

interface SecurityProfileRunFixFormProps {
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
              <>
                <Row className="u-no-padding">
                  <InfoItem
                    label="Delivery time"
                    value={
                      profile.restart_deliver_delay === 0
                        ? "As soon as possible"
                        : "Scheduled"
                    }
                  />
                </Row>

                <Row className="u-no-padding">
                  <InfoItem
                    label="Randomize delivery over a time window"
                    value={
                      profile.restart_deliver_delay
                        ? `${profile.restart_deliver_delay_window} minutes`
                        : "No"
                    }
                  />
                </Row>
              </>
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
