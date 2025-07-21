import type { FC } from "react";
import { Button, CheckboxInput, Modal } from "@canonical/react-components";
import { useBoolean } from "usehooks-ts";

interface ConsentBannerProps {
  readonly onClose: () => void;
}

const ConsentBannerModal: FC<ConsentBannerProps> = ({ onClose }) => {
  const { value: consentAcknowledged, toggle: toggleAcknowledged } =
    useBoolean();

  return (
    <Modal
      title="Proceed After Acknowledging Consent"
      className="is-narrow"
      buttonRow={
        <Button
          appearance="positive"
          className="u-no-margin--bottom"
          onClick={onClose}
          disabled={!consentAcknowledged}
        >
          Proceed
        </Button>
      }
    >
      <section>
        <p>
          You are accessing a U.S. Government (USG) Information System (IS) that
          is provided for USG authorized use only. By using this IS (which
          includes any device attached to this IS), you consent to the following
          conditions:
        </p>
        <ul>
          <li>
            The USG routinely intercepts and monitors communications on this IS
            for purposes including, but not limited to, penetration testing,
            COMSEC monitoring, network operations and defense, personnel
            misconduct (PM), law enforcement (LE), and counterintelligence (CI)
            investigations.
          </li>
          <li>
            At any time, the USG may inspect and seize data stored on this IS.
            Communications using, or data stored on, this IS are not private,
            are subject to routine monitoring, interception, and search, and may
            be disclosed or used for any USG authorized purpose.
          </li>
          <li>
            This IS includes security measures (e.g., authentication and access
            controls) to protect USG interests - not for your personal benefit
            or privacy.
          </li>
          <li>
            Notwithstanding the above, using this IS does not constitute consent
            to PM, LE or CI investigative searching or monitoring of the content
            of privileged communications, or work product, related to personal
            representation or services by attorneys, psychotherapists, or
            clergy, and their assistants. Such communications and work product
            are private and confidential. See User Agreement for details.
          </li>
        </ul>
        <p>
          <CheckboxInput
            inline
            label="I acknowledge that I have read and understood the above consent notice."
            onChange={toggleAcknowledged}
          />
        </p>
      </section>
    </Modal>
  );
};

export default ConsentBannerModal;
