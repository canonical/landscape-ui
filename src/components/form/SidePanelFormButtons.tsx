import { FC } from "react";
import { Button } from "@canonical/react-components";
import useSidePanel from "../../hooks/useSidePanel";

interface SidePanelFormButtonsProps {
  disabled: boolean;
  positiveButtonTitle: string;
  buttonAriaLabel: string;
  specificButtonStyle?: string;
}

const SidePanelFormButtons: FC<SidePanelFormButtonsProps> = ({
  disabled,
  positiveButtonTitle,
  buttonAriaLabel,
  specificButtonStyle = "",
}) => {
  const { closeSidePanel } = useSidePanel();
  return (
    <>
      <Button
        className={specificButtonStyle}
        type="submit"
        appearance="positive"
        disabled={disabled}
        aria-label={buttonAriaLabel}
      >
        {positiveButtonTitle}
      </Button>
      <Button
        className={specificButtonStyle}
        type="button"
        onClick={closeSidePanel}
      >
        Cancel
      </Button>
    </>
  );
};

export default SidePanelFormButtons;
