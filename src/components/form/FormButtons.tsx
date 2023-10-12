import { FC } from "react";
import { Button } from "@canonical/react-components";
import { useFormikContext } from "formik";
import useSidePanel from "../../hooks/useSidePanel";

interface FormButtonsProps {
  isLoading: boolean;
  positiveButtonTitle: string;
  buttonAriaLabel: string;
  specificButtonStyle?: string;
}

const FormButtons: FC<FormButtonsProps> = ({
  isLoading,
  positiveButtonTitle,
  buttonAriaLabel,
  specificButtonStyle = "",
}) => {
  const { closeSidePanel } = useSidePanel();
  const { submitForm } = useFormikContext();
  return (
    <>
      <Button
        className={specificButtonStyle}
        type="button"
        appearance="positive"
        disabled={isLoading}
        aria-label={buttonAriaLabel}
        onClick={() => submitForm()}
      >
        {positiveButtonTitle}
      </Button>
      <Button
        className={specificButtonStyle}
        type="button"
        onClick={() => closeSidePanel()}
      >
        Cancel
      </Button>
    </>
  );
};

export default FormButtons;
