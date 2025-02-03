import type { FC, ReactNode } from "react";
import React, { createContext, useEffect, useState } from "react";
import classNames from "classnames";
import { useLocation } from "react-router";
import AppNotification from "@/components/layout/AppNotification";
import useNotify from "@/hooks/useNotify";
import classes from "./SidePanelProvider.module.scss";
import { Button, Icon, ICONS } from "@canonical/react-components";
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";

interface SidePanelContextProps {
  changeSidePanelSize: (size: "small" | "medium" | "large") => void;
  changeSidePanelTitleLabel: (title: string) => void;
  closeSidePanel: () => void;
  setSidePanelContent: (
    title: string,
    newState: ReactNode | null,
    size?: "small" | "medium" | "large",
    titleLabel?: string,
  ) => void;
}

const initialState: SidePanelContextProps = {
  changeSidePanelSize: () => undefined,
  changeSidePanelTitleLabel: () => undefined,
  closeSidePanel: () => undefined,
  setSidePanelContent: () => undefined,
};

export const SidePanelContext =
  createContext<SidePanelContextProps>(initialState);

interface SidePanelProviderProps {
  readonly children: ReactNode;
}

const SidePanelProvider: FC<SidePanelProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<"small" | "medium" | "large">("small");
  const [title, setTitle] = useState("");
  const [titleLabel, setTitleLabel] = useState("");
  const [body, setBody] = useState<ReactNode | null>(null);

  const { pathname } = useLocation();
  const { notify, sidePanel } = useNotify();

  useEffect(() => {
    return handleClose;
  }, [pathname]);

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setTitleLabel("");
    setBody(null);
    setSize("small");
    sidePanel.setOpen(false);
  };

  const handleSidePanelClose = () => {
    handleClose();
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
        changeSidePanelSize: (size) => setSize(size),
        changeSidePanelTitleLabel: (title) => setTitleLabel(title),
        closeSidePanel: handleSidePanelClose,
        setSidePanelContent: handleContentChange,
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
          <AppErrorBoundary>
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
                {body}
              </div>
            </div>
          </AppErrorBoundary>
        )}
      </aside>
    </SidePanelContext.Provider>
  );
};

export default SidePanelProvider;
