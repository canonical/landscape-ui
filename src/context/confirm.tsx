import { createContext, FC, ReactNode, useState } from "react";
import { Button, Modal } from "@canonical/react-components";

interface DialogProps {
  title: string;
  body: string;
  buttons: ReactNode[];
  cancelButtonLabel?: string;
}

export interface ConfirmContextProps {
  confirmModal: (props: DialogProps) => void;
  closeConfirmModal: () => void;
}

const initialState: ConfirmContextProps = {
  confirmModal: () => undefined,
  closeConfirmModal: () => undefined,
};

export const ConfirmContext = createContext<ConfirmContextProps>(initialState);

type ConfirmProviderProps = {
  children: ReactNode;
};

const ConfirmProvider: FC<ConfirmProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Are you sure?");
  const [body, setBody] = useState("");
  const [cancelButtonLabel, setCancelButtonLabel] = useState("");
  const [buttons, setButtons] = useState<ReactNode[]>([]);

  const handleClose = () => {
    setOpen(false);
  };

  const confirmModal = ({
    title,
    body,
    buttons,
    cancelButtonLabel = "Cancel",
  }: DialogProps) => {
    setButtons(buttons);
    setTitle(title);
    setBody(body);
    setCancelButtonLabel(cancelButtonLabel);

    setOpen(true);
  };

  return (
    <ConfirmContext.Provider
      value={{
        confirmModal,
        closeConfirmModal: handleClose,
      }}
    >
      {children}
      {open && (
        <Modal
          close={handleClose}
          title={title}
          buttonRow={
            <>
              <Button onClick={handleClose}>{cancelButtonLabel}</Button>
              {buttons.length && <>{buttons.map((button) => button)}</>}
            </>
          }
        >
          <p>{body}</p>
        </Modal>
      )}
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
