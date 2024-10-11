import { Button } from "@canonical/react-components";
import { FC, ReactElement, ReactNode, SyntheticEvent } from "react";
import useSidePanel from "../../hooks/useSidePanel";
import classes from "./SidePanelFormButtons.module.scss";

interface SidePanelFormButtonsProps {
  submitButtonDisabled: boolean;
  submitButtonText: string;
  submitButtonAppearance?: "positive" | "negative";
  submitButtonAriaLabel?: string;
  secondaryActionButtonTitle?: ReactNode;
  secondaryActionButtonSubmit?: (event: SyntheticEvent) => Promise<void> | void;
  cancelButtonDisabled?: boolean;
  onSubmit?: (event: SyntheticEvent) => Promise<void> | void;
}

const SidePanelFormButtons: FC<SidePanelFormButtonsProps> = ({
  submitButtonDisabled,
  submitButtonText,
  submitButtonAriaLabel,
  secondaryActionButtonTitle,
  secondaryActionButtonSubmit,
  onSubmit,
  submitButtonAppearance = "positive",
  cancelButtonDisabled = false,
}): ReactElement => {
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
      {secondaryActionButtonTitle && secondaryActionButtonSubmit && (
        <Button
          type="button"
          className="u-no-margin--bottom"
          onClick={secondaryActionButtonSubmit}
        >
          {secondaryActionButtonTitle}
        </Button>
      )}
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
