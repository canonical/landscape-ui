import { CheckboxInput, ConfirmationModal } from "@canonical/react-components";
import type { ComponentProps } from "react";
import { useState, type FC } from "react";

interface IgnorableModalProps
  extends Omit<
      ComponentProps<typeof ConfirmationModal>,
      "children" | "close" | "onConfirm"
    >,
    Partial<Pick<ComponentProps<typeof ConfirmationModal>, "children">> {
  readonly hideModal: Required<
    ComponentProps<typeof ConfirmationModal>
  >["close"] &
    ComponentProps<typeof ConfirmationModal>["onConfirm"];
  readonly hideNotification: ComponentProps<
    typeof ConfirmationModal
  >["onConfirm"];
  readonly ignore: ComponentProps<typeof ConfirmationModal>["onConfirm"];
  readonly checkboxProps?: Omit<
    ComponentProps<typeof CheckboxInput>,
    "checked" | "onChange"
  >;
}

const IgnorableModal: FC<IgnorableModalProps> = ({
  checkboxProps = { label: undefined },
  children,
  hideModal,
  hideNotification,
  ignore,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const confirmModal: IgnorableModalProps["hideNotification"] = (event) => {
    hideModal(event);
    hideNotification(event);

    if (isChecked) {
      ignore(event);
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
        checked={isChecked}
        onChange={toggleIsChecked}
        {...checkboxProps}
      />
    </ConfirmationModal>
  );
};

export default IgnorableModal;
