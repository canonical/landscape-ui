import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import AppNotification from "@/components/layout/AppNotification";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { Button, Icon, ICONS } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import classes from "./SidePanelProvider.module.scss";

export type SidePanelSize = "small" | "medium" | "large";

interface SidePanelContextProps {
  changeSidePanelSize: (size: SidePanelSize) => void;
  changeSidePanelTitleLabel: (title: string) => void;
  closeSidePanel: () => void;
  setSidePanelContent: (
    title: ReactNode,
    newState: ReactNode | null,
    size?: SidePanelSize,
    titleLabel?: string,
  ) => void;
  setSidePanelTitle: (title: ReactNode) => void;
}

const initialState: SidePanelContextProps = {
  changeSidePanelSize: () => undefined,
  changeSidePanelTitleLabel: () => undefined,
  closeSidePanel: () => undefined,
  setSidePanelContent: () => undefined,
  setSidePanelTitle: () => undefined,
};

export const SidePanelContext =
  createContext<SidePanelContextProps>(initialState);

interface SidePanelProviderProps {
  readonly children: ReactNode;
}

const SidePanelProvider: FC<SidePanelProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<SidePanelSize>("small");
  const [title, setTitle] = useState<ReactNode>(undefined);
  const [titleLabel, setTitleLabel] = useState("");
  const [body, setBody] = useState<ReactNode | null>(null);

  const { pathname } = useLocation();
  const { notify, sidePanel } = useNotify();
  const { tab } = usePageParams();

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setTitleLabel("");
    setBody(null);
    setSize("small");
    sidePanel.setOpen(false);
  };

  useEffect(() => {
    return handleClose;
  }, [pathname, tab]);

  const handleSidePanelClose = () => {
    handleClose();
    notify.clear();
  };

  const handleTitleChange = (newTitle: ReactNode) => {
    setTitle(newTitle);
  };

  const handleContentChange = (
    newTitle: ReactNode,
    newBody: ReactNode,
    newSize: SidePanelSize = "small",
  ) => {
    handleTitleChange(newTitle);
    setBody(newBody);
    setSize(newSize);
    sidePanel.setOpen(true);
    notify.clear();
    setOpen(true);
  };

  return (
    <SidePanelContext.Provider
      value={{
        changeSidePanelSize: (newSize) => {
          setSize(newSize);
        },
        changeSidePanelTitleLabel: (newTitle) => {
          setTitleLabel(newTitle);
        },
        closeSidePanel: handleSidePanelClose,
        setSidePanelContent: handleContentChange,
        setSidePanelTitle: handleTitleChange,
      }}
    >
      {children}
      <aside
        className={classNames("l-aside", {
          "is-collapsed": !open,
          [classes.container]: open,
          "is-wide": ["medium", "large"].includes(size),
          [classes.medium]: size === "medium",
        })}
      >
        {open && (
          <>
            <div className={classNames("p-panel__header", classes.header)}>
              <h3 className="p-panel__title">{title}</h3>
              <p className="u-text--muted">
                <i>{titleLabel}</i>
              </p>
              <div className="p-panel__controls">
                <Button
                  type="button"
                  onClick={handleSidePanelClose}
                  className="p-button--base u-no-margin--bottom has-icon"
                  aria-label="Close side panel"
                >
                  <Icon name={ICONS.close} />
                </Button>
              </div>
            </div>
            <div className={classNames("p-panel__content", classes.outerDiv)}>
              <div className={classNames("p-panel__inner", classes.innerDiv)}>
                {notify.notification?.type === "negative" && (
                  <AppNotification notify={notify} isSidePanelOpen={true} />
                )}
                <AppErrorBoundary>{body}</AppErrorBoundary>
              </div>
            </div>
          </>
        )}
      </aside>
    </SidePanelContext.Provider>
  );
};

export default SidePanelProvider;
