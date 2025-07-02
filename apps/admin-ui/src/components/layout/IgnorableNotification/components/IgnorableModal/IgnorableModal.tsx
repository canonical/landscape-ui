import { CheckboxInput, ConfirmationModal } from "@canonical/react-components";
import type { ComponentProps, FC, MouseEvent, ReactNode } from "react";
import { useState } from "react";

interface IgnorableModalProps
  extends Omit<
    ComponentProps<typeof ConfirmationModal>,
    "children" | "close" | "onConfirm"
  > {
  readonly hideModal: () => void;
  readonly hideNotification: (event: MouseEvent<HTMLElement>) => void;
  readonly ignore: (event: MouseEvent<HTMLElement>) => void;
  readonly checkboxProps?: Omit<
    ComponentProps<typeof CheckboxInput>,
    "checked" | "onChange"
  >;
  readonly children?: ReactNode;
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
    hideModal();
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
      {<>{children}</>}

      <CheckboxInput
        checked={isChecked}
        onChange={toggleIsChecked}
        {...checkboxProps}
      />
    </ConfirmationModal>
  );
};

export default IgnorableModal;
