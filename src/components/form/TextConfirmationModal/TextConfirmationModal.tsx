import { ConfirmationModal, Input } from "@canonical/react-components";
import type {
  ChangeEventHandler,
  ComponentProps,
  MouseEventHandler,
} from "react";
import { useState, type FC } from "react";
import classes from "./TextConfirmationModal.module.scss";

interface TextConfirmationModalProps
  extends ComponentProps<typeof ConfirmationModal> {
  readonly confirmationText?: string;
  readonly confirming?: boolean;
  readonly onSuccess?: MouseEventHandler<HTMLElement>;
}

const TextConfirmationModal: FC<TextConfirmationModalProps> = ({
  children,
  close = () => undefined,
  confirmButtonDisabled,
  confirmButtonLoading,
  confirmationText,
  confirming,
  onConfirm,
  onSuccess = () => undefined,
  ...props
}) => {
  const [inputText, setInputText] = useState("");

  const closeModal = () => {
    close();
    setInputText("");
  };

  const confirmModal: MouseEventHandler<HTMLElement> = async (event) => {
    onConfirm(event);
    closeModal();
    onSuccess(event);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setInputText(event.target.value);
  };

  return (
    <ConfirmationModal
      {...props}
      confirmButtonDisabled={
        inputText != confirmationText || confirming || confirmButtonDisabled
      }
      confirmButtonLoading={confirming || confirmButtonLoading}
      onConfirm={confirmModal}
      close={closeModal}
    >
      {children}

      <p>
        Type{" "}
        <strong className={classes.confirmation}>{confirmationText}</strong> to
        confirm.
      </p>

      <Input type="text" value={inputText} onChange={handleInputChange} />
    </ConfirmationModal>
  );
};

export default TextConfirmationModal;
