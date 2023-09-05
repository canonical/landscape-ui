import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import AppNotification from "../components/layout/AppNotification";
import useNotify from "../hooks/useNotify";

interface SidePanelContextProps {
  setSidePanelOpen: (newState: boolean) => void;
  setSidePanelContent: (title: string, newState: ReactNode | null) => void;
  closeSidePanel: () => void;
  isSidePanelOpen: boolean;
}

const initialState: SidePanelContextProps = {
  setSidePanelOpen: () => undefined,
  setSidePanelContent: () => undefined,
  closeSidePanel: () => undefined,
  isSidePanelOpen: false,
};

export const SidePanelContext =
  createContext<SidePanelContextProps>(initialState);

interface SidePanelProviderProps {
  children: ReactNode;
}

const SidePanelProvider: FC<SidePanelProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState<ReactNode | null>(null);

  const { pathname } = useLocation();
  const notify = useNotify();

  useEffect(() => {
    if (!open) {
      return;
    }

    notify.clear();
  }, [open]);

  useEffect(() => {
    return handleClose;
  }, [pathname]);

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setBody(null);
    notify.clear();
  };

  return (
    <SidePanelContext.Provider
      value={{
        setSidePanelOpen: (newState) => setOpen(newState),
        setSidePanelContent: (title, body) => {
          setTitle(title);
          setBody(body);
        },
        closeSidePanel: handleClose,
        isSidePanelOpen: open,
      }}
    >
      {children}
      <aside
        className={classNames("l-aside", {
          "is-collapsed": !open,
        })}
      >
        <div className="p-panel__header">
          <h4 className="p-panel__title">{title}</h4>
          <div className="p-panel__controls">
            <button
              onClick={handleClose}
              className="p-button--base u-no-margin--bottom has-icon"
              aria-label="Close side panel"
            >
              <i className="p-icon--close" />
            </button>
          </div>
        </div>
        <div className="p-panel__content">
          <div className="p-panel__inner">
            <AppNotification notify={notify} />
            {body}
          </div>
        </div>
      </aside>
    </SidePanelContext.Provider>
  );
};

export default SidePanelProvider;
