import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router";
import { ROOT_PATH } from "@/constants";
import useNotificationHelper from "@/hooks/useNotificationHelper";
import { NotificationHelper } from "@/types/Notification";

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
  children: ReactNode;
}

const NotifyProvider: FC<NotifyProviderProps> = ({ children }) => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const notify = useNotificationHelper();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === `${ROOT_PATH}login`) {
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
          setOpen: (newState) => setIsSidePanelOpen(newState),
        },
      }}
    >
      {children}
    </NotifyContext.Provider>
  );
};

export default NotifyProvider;
