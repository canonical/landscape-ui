import React, { FC, ReactNode } from "react";
import { Modal } from "@canonical/react-components";

interface DialogProps {
  title?: string;
  body?: string;
  cancelButtonLabel?: string;
  buttons: React.ReactNode[];
}

export interface ConfirmContextProps {
  confirmModal: (props: DialogProps) => void;
  closeConfirmModal: () => void;
}

const initialState: ConfirmContextProps = {
  confirmModal: () => undefined,
  closeConfirmModal: () => undefined,
};

export const ConfirmContext =
  React.createContext<ConfirmContextProps>(initialState);

type ConfirmProviderProps = {
  children: ReactNode;
};

const ConfirmProvider: FC<ConfirmProviderProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("Are you sure?");
  const [body, setBody] = React.useState("");
  const [cancelButtonLabel, setCancelButtonLabel] = React.useState("Cancel");
  const [buttons, setButtons] = React.useState<React.ReactNode[]>([]);

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

    if (title) {
      setTitle(title);
    }

    if (body) {
      setBody(body);
    }

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
      {open ? (
        <Modal
          close={handleClose}
          title={title}
          buttonRow={
            <>
              <button className="u-no-margin--bottom" onClick={handleClose}>
                {cancelButtonLabel}
              </button>
              {buttons.length ? <>{buttons.map((button) => button)}</> : null}
            </>
          }
        >
          {body ? <p>{body}</p> : null}
        </Modal>
      ) : null}
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
