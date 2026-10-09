import type { FC } from "react";
import { Button, Modal } from "@canonical/react-components";
import { FEEDBACK_LINK } from "@/constants";

interface WelcomeBannerProps {
  readonly hideBanner: () => void;
}

const WelcomePopupModal: FC<WelcomeBannerProps> = ({ hideBanner }) => {
  return (
    <Modal
      close={hideBanner}
      title="Landscape web portal"
      buttonRow={
        <Button
          appearance="positive"
          className="u-no-margin--bottom"
          onClick={hideBanner}
        >
          Got it!
        </Button>
      }
    >
      <p className="u-margin--bottom">Welcome to the Landscape web portal!</p>
      <p className="u-margin--bottom">
        We are in the process of retiring the classic portal, and this is now
        the default portal.
      </p>
      <p className="u-margin--bottom">
        You can switch back to the classic portal at any time and{" "}
        <a href={FEEDBACK_LINK} target="_blank" rel="noopener noreferrer">
          share your feedback with us on Discourse
        </a>
        .
      </p>
    </Modal>
  );
};

export default WelcomePopupModal;
