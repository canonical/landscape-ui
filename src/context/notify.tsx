import type { FC, ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { matchPath, useLocation } from "react-router";
import useNotificationHelper from "@/hooks/useNotificationHelper";
import type { NotificationHelper } from "@/types/Notification";
import { PATHS } from "@/libs/routes";

interface NotifyContextProps {
  notify: NotificationHelper;
  inlineErrors: boolean;
  sidePanel: {
    open: boolean;
    setOpen: (newState: boolean) => void;
  };
}

const initialState: NotifyContextProps = {
  inlineErrors: false,
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
  const inlineErrors = [
    PATHS.auth.login,
    PATHS.auth.supportLogin,
    PATHS.auth.createAccount,
    PATHS.auth.invitation,
  ].some((path) => Boolean(matchPath(path, pathname)));

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
        inlineErrors,
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
