import type { FC, ReactNode } from "react";
import React, { useContext, useLayoutEffect, useMemo, useRef } from "react";
import type { AxiosInstance } from "axios";
import axios from "axios";
import { API_URL_OLD } from "@/constants";
import { AuthContext } from "@/context/auth";
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from "@/api/interceptors";

export const FetchContext = React.createContext<AxiosInstance | null>(null);

interface FetchProviderProps {
  readonly children: ReactNode;
}

const FetchOldProvider: FC<FetchProviderProps> = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  const tokenRef = useRef(user?.token);
  const logoutRef = useRef(logout);

  const authFetch = useMemo(() => {
    return axios.create({ baseURL: API_URL_OLD });
  }, []);

  useLayoutEffect(() => {
    tokenRef.current = user?.token;
    logoutRef.current = logout;
  });

  // 4. Attach Interceptors synchronously before children mount/update
  useLayoutEffect(() => {
    const cleanupRequest = setupRequestInterceptor(
      authFetch,
      () => tokenRef.current,
      true,
    );

    const cleanupResponse = setupResponseInterceptor(
      authFetch,
      () => logoutRef.current,
    );

    return () => {
      cleanupRequest();
      cleanupResponse();
    };
  }, [authFetch]);

  return (
    <FetchContext.Provider value={authFetch}>{children}</FetchContext.Provider>
  );
};

export default FetchOldProvider;
