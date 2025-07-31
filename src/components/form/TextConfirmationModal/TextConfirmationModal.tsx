import { ConfirmationModal, Form, Input } from "@canonical/react-components";
import { type ComponentProps, type FC, useState } from "react";
import classes from "./TextConfirmationModal.module.scss";

interface TextConfirmationModalProps
  extends ComponentProps<typeof ConfirmationModal> {
  readonly confirmationText: string;
  readonly close: () => void;
  readonly onConfirm: () => Promise<void>;
  readonly isOpen: boolean;
}

const TextConfirmationModal: FC<TextConfirmationModalProps> = ({
  children,
  confirmButtonDisabled,
  confirmButtonLoading,
  confirmationText,
  onConfirm,
  close,
  isOpen,
  ...props
}) => {
  const [inputText, setInputText] = useState("");

  if (!isOpen) {
    return null;
  }

  const closeModal = () => {
    close();
    setInputText("");
  };

  const isTextValid =
    inputText.toLowerCase() === confirmationText.toLowerCase();

  const handleSubmit = async () => {
    if (isTextValid) {
      await onConfirm();
      setInputText("");
    }
  };

  const handleConfirmationTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputText(e.target.value);
  };

  return (
    <ConfirmationModal
      {...props}
      confirmButtonDisabled={
        !isTextValid || confirmButtonLoading || confirmButtonDisabled
      }
      confirmButtonProps={{ type: "submit" }}
      confirmButtonLoading={confirmButtonLoading}
      onConfirm={handleSubmit}
      close={closeModal}
    >
      <Form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {children}

        <p>
          Type{" "}
          <span className={classes.confirmationText}>{confirmationText}</span>{" "}
          to confirm.
        </p>

        <Input
          type="text"
          placeholder={confirmationText}
          autoComplete="off"
          value={inputText}
          onChange={handleConfirmationTextChange}
        />
      </Form>
    </ConfirmationModal>
  );
};

export default TextConfirmationModal;
