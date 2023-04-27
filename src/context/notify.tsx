import React, { createContext, FC, ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useNotificationHelper from "../hooks/useNotificationHelper";
import { NotificationHelper } from "../types/Notification";

const initialState: NotificationHelper = {
  notification: null,
  error: () => undefined,
  info: () => undefined,
  success: () => undefined,
  clear: () => undefined,
};

export const NotifyContext = createContext<NotificationHelper>(initialState);

interface NotifyProviderProps {
  children: ReactNode;
}

const NotifyProvider: FC<NotifyProviderProps> = ({ children }) => {
  const notify = useNotificationHelper();
  const { pathname } = useLocation();

  if (!notify) {
    return null;
  }

  useEffect(() => {
    return notify.clear;
  }, [pathname]);

  return (
    <NotifyContext.Provider value={notify}>{children}</NotifyContext.Provider>
  );
};

export default NotifyProvider;
