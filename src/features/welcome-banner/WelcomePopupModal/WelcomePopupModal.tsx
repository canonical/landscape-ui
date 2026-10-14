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
        The web portal is now the default interface for Landscape. Our legacy
        web portal is being retired, but remains available for now if you’d like
        to switch back.
      </p>
      <p className="u-margin--bottom">
        You can{" "}
        <a href={FEEDBACK_LINK} target="_blank" rel="noopener noreferrer">
          report issues or share feedback on Launchpad
        </a>
        .
      </p>
    </Modal>
  );
};

export default WelcomePopupModal;
