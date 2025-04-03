import { CheckboxInput, ConfirmationModal } from "@canonical/react-components";
import type { ComponentProps } from "react";
import { useState, type FC } from "react";

interface IgnorableModalProps
  extends Omit<
    ComponentProps<typeof ConfirmationModal>,
    "close" | "onConfirm"
  > {
  readonly checkboxProps: Omit<
    ComponentProps<typeof CheckboxInput>,
    "checked" | "onChange"
  >;
  readonly hideModal: () => void;
  readonly hideNotification: () => void;
  readonly ignore: () => void;
}

const IgnorableModal: FC<IgnorableModalProps> = ({
  checkboxProps,
  children,
  hideModal,
  hideNotification,
  ignore,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const confirmModal = () => {
    hideModal();
    hideNotification();

    if (isChecked) {
      ignore();
    }
  };

  const closeModal = () => {
    hideModal();
    setIsChecked(false);
  };

  const toggleIsChecked = () => {
    setIsChecked((value) => !value);
  };

  return (
    <ConfirmationModal {...props} onConfirm={confirmModal} close={closeModal}>
      {children}

      <CheckboxInput
        {...checkboxProps}
        checked={isChecked}
        onChange={toggleIsChecked}
      />
    </ConfirmationModal>
  );
};

export default IgnorableModal;
