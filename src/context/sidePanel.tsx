import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import AppNotification from "@/components/layout/AppNotification";
import useNotify from "@/hooks/useNotify";
import classes from "./SidePanelProvider.module.scss";

interface SidePanelContextProps {
  setSidePanelContent: (
    title: string,
    newState: ReactNode | null,
    size?: "small" | "medium" | "large",
  ) => void;
  closeSidePanel: () => void;
}

const initialState: SidePanelContextProps = {
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
  const [size, setSize] = useState<"small" | "medium" | "large">("small");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState<ReactNode | null>(null);

  const { pathname } = useLocation();
  const { notify, sidePanel } = useNotify();

  useEffect(() => {
    return handleClose;
  }, [pathname]);

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setBody(null);
    setSize("small");
    sidePanel.setOpen(false);
    notify.clear();
  };

  const handleContentChange = (
    newTitle: string,
    newBody: ReactNode,
    newSize: "small" | "medium" | "large" = "small",
  ) => {
    setTitle(newTitle);
    setBody(newBody);
    setSize(newSize);
    sidePanel.setOpen(true);
    notify.clear();
    setOpen(true);
  };

  return (
    <SidePanelContext.Provider
      value={{
        setSidePanelContent: handleContentChange,
        closeSidePanel: handleClose,
      }}
    >
      {children}
      <aside
        className={classNames(
          "l-aside",
          {
            "is-collapsed": !open,
            "is-wide": ["medium", "large"].includes(size),
            [classes.medium]: size === "medium",
          },
          classes.container,
        )}
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
        <div className={classNames("p-panel__content", classes.outerDiv)}>
          <div className={classNames("p-panel__inner", classes.innerDiv)}>
            <AppNotification notify={notify} isSidePanelOpen={true} />
            {body}
          </div>
        </div>
      </aside>
    </SidePanelContext.Provider>
  );
};

export default SidePanelProvider;
