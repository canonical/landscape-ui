import { FC } from "react";
import { Button, Modal } from "@canonical/react-components";
import { FEEDBACK_LINK } from "@/constants";

interface WelcomeBannerProps {
  hideBanner: () => void;
}

const WelcomePopupModal: FC<WelcomeBannerProps> = ({ hideBanner }) => {
  return (
    <Modal
      close={hideBanner}
      title="Landscape web portal (Preview)"
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
      <p>Welcome to the new Landscape web portal (Preview)!</p>
      <p>
        This portal is still a work-in-progress. Some features may not be
        available yet and you may encounter some bugs.
      </p>
      <p>
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
