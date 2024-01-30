import { FC } from "react";
import { Button } from "@canonical/react-components";
import useSidePanel from "../../hooks/useSidePanel";
import classes from "./SidePanelFormButtons.module.scss";
import classNames from "classnames";

interface SidePanelFormButtonsProps {
  disabled: boolean;
  submitButtonText: string;
  bottomSticky?: boolean;
  removeButtonMargin?: boolean;
  submitButtonAppearance?: "positive" | "negative" | "brand";
  submitButtonAriaLabel?: string;
}

const SidePanelFormButtons: FC<SidePanelFormButtonsProps> = ({
  disabled,
  submitButtonText,
  submitButtonAriaLabel,
  bottomSticky = false,
  removeButtonMargin = true,
  submitButtonAppearance = "positive",
}) => {
  const { closeSidePanel } = useSidePanel();
  return (
    <div
      className={classNames({
        [classes.buttons]: bottomSticky,
        "form-buttons": !bottomSticky,
      })}
    >
      <Button
        className={classNames({ "u-no-margin--bottom": removeButtonMargin })}
        type="submit"
        appearance={submitButtonAppearance}
        disabled={disabled}
        aria-label={submitButtonAriaLabel}
      >
        {submitButtonText}
      </Button>
      <Button
        className={classNames({ "u-no-margin--bottom": removeButtonMargin })}
        type="button"
        onClick={closeSidePanel}
        disabled={disabled}
      >
        Cancel
      </Button>
    </div>
  );
};

export default SidePanelFormButtons;
