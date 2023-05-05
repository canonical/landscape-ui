import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import classNames from "classnames";
import { useLocation } from "react-router-dom";

interface SidePanelContextProps {
  setSidePanelOpen: (newState: boolean) => void;
  setSidePanelContent: (title: string, newState: ReactNode | null) => void;
  closeSidePanel: () => void;
}

const initialState: SidePanelContextProps = {
  setSidePanelOpen: () => undefined,
  setSidePanelContent: () => undefined,
  closeSidePanel: () => undefined,
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

  useEffect(() => {
    return handleClose;
  }, [pathname]);

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setBody(null);
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
              <i className="p-icon--close"></i>
            </button>
          </div>
        </div>
        <div className="p-panel__content">
          <div className="p-panel__inner">{body}</div>
        </div>
      </aside>
    </SidePanelContext.Provider>
  );
};

export default SidePanelProvider;
