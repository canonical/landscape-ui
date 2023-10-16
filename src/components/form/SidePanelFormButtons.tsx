import { FC } from "react";
import { Button } from "@canonical/react-components";
import useSidePanel from "../../hooks/useSidePanel";
import classes from "./SidePanelFormButtons.module.scss";
import classNames from "classnames";
interface SidePanelFormButtonsProps {
  disabled: boolean;
  positiveButtonTitle: string;
  buttonAriaLabel?: string;
  bottomSticky?: boolean;
  removeButtonMargin?: boolean;
}

const SidePanelFormButtons: FC<SidePanelFormButtonsProps> = ({
  disabled,
  positiveButtonTitle,
  buttonAriaLabel,
  bottomSticky = false,
  removeButtonMargin = true,
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
        appearance="positive"
        disabled={disabled}
        aria-label={buttonAriaLabel}
      >
        {positiveButtonTitle}
      </Button>
      <Button
        className={classNames({ "u-no-margin--bottom": removeButtonMargin })}
        type="button"
        onClick={closeSidePanel}
      >
        Cancel
      </Button>
    </div>
  );
};

export default SidePanelFormButtons;
