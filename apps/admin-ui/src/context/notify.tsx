import type { FC, ReactNode } from "react";
import React, { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import useNotificationHelper from "@/hooks/useNotificationHelper";
import type { NotificationHelper } from "@/types/Notification";

interface NotifyContextProps {
  notify: NotificationHelper;
  sidePanel: {
    open: boolean;
    setOpen: (newState: boolean) => void;
  };
}

const initialState: NotifyContextProps = {
  notify: {
    notification: null,
    error: () => undefined,
    info: () => undefined,
    success: () => undefined,
    clear: () => undefined,
  },
  sidePanel: {
    open: false,
    setOpen: () => undefined,
  },
};

export const NotifyContext = createContext<NotifyContextProps>(initialState);

interface NotifyProviderProps {
  readonly children: ReactNode;
}

const NotifyProvider: FC<NotifyProviderProps> = ({ children }) => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const notify = useNotificationHelper();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/login") {
      return;
    }

    notify.clear();
  }, [pathname]);

  return (
    <NotifyContext.Provider
      value={{
        notify,
        sidePanel: {
          open: isSidePanelOpen,
          setOpen: (newState) => {
            setIsSidePanelOpen(newState);
          },
        },
      }}
    >
      {children}
    </NotifyContext.Provider>
  );
};

export default NotifyProvider;
