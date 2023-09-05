import { createContext, FC, isValidElement, ReactNode, useState } from "react";
import { Modal } from "@canonical/react-components";

interface DialogProps {
  title: string;
  body: ReactNode;
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
  const [body, setBody] = useState<ReactNode>(null);
  const [cancelButtonLabel, setCancelButtonLabel] = useState("Cancel");
  const [buttons, setButtons] = useState<ReactNode[]>([]);

  const handleClose = () => {
    setOpen(false);
  };

  const confirmModal = ({
    title,
    body,
    buttons,
    cancelButtonLabel,
  }: DialogProps) => {
    setButtons(buttons);

    setTitle(title);

    setBody(body);

    if (cancelButtonLabel) {
      setCancelButtonLabel(cancelButtonLabel);
    }

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
              <button className="u-no-margin--bottom" onClick={handleClose}>
                {cancelButtonLabel}
              </button>
              {buttons.length && <>{buttons.map((button) => button)}</>}
            </>
          }
        >
          {"string" === typeof body ? (
            <p>{body}</p>
          ) : isValidElement(body) ? (
            body
          ) : null}
        </Modal>
      )}
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
