import { FC, SyntheticEvent } from "react";
import { Button } from "@canonical/react-components";
import useSidePanel from "../../hooks/useSidePanel";
import classes from "./SidePanelFormButtons.module.scss";

interface SidePanelFormButtonsProps {
  submitButtonDisabled: boolean;
  submitButtonText: string;
  submitButtonAppearance?: "positive" | "negative";
  submitButtonAriaLabel?: string;
  cancelButtonDisabled?: boolean;
  onSubmit?: (event: SyntheticEvent) => Promise<void> | void;
}

const SidePanelFormButtons: FC<SidePanelFormButtonsProps> = ({
  submitButtonDisabled,
  submitButtonText,
  submitButtonAriaLabel,
  onSubmit,
  submitButtonAppearance = "positive",
  cancelButtonDisabled = false,
}) => {
  const { closeSidePanel } = useSidePanel();
  return (
    <div className={classes.buttons}>
      <Button
        className="u-no-margin--bottom"
        type="button"
        appearance="base"
        onClick={closeSidePanel}
        disabled={cancelButtonDisabled}
      >
        Cancel
      </Button>
      <Button
        className="u-no-margin--bottom"
        type={onSubmit ? "button" : "submit"}
        onClick={onSubmit}
        appearance={submitButtonAppearance}
        disabled={submitButtonDisabled}
        aria-label={submitButtonAriaLabel}
      >
        {submitButtonText}
      </Button>
    </div>
  );
};

export default SidePanelFormButtons;
