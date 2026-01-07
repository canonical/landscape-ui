import type { FC, ReactNode } from "react";
import React, {
  useContext,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
} from "react";
import type { AxiosInstance } from "axios";
import axios from "axios";
import { API_URL } from "@/constants";
import { AuthContext } from "@/context/auth";
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from "@/api/interceptors";

export const FetchContext = React.createContext<AxiosInstance | null>(null);

interface FetchProviderProps {
  readonly children: ReactNode;
}

const FetchProvider: FC<FetchProviderProps> = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  const authFetch = useMemo(() => {
    return axios.create({ baseURL: API_URL });
  }, []);

  const getLatestToken = useEffectEvent(() => {
    return user?.token;
  });

  const onLogout = useEffectEvent(() => {
    logout();
  });

  useLayoutEffect(() => {
    const cleanupRequest = setupRequestInterceptor(
      authFetch,
      getLatestToken,
      false,
    );

    const cleanupResponse = setupResponseInterceptor(authFetch, () => onLogout);

    return () => {
      cleanupRequest();
      cleanupResponse();
    };
  }, [authFetch]);

  return (
    <FetchContext.Provider value={authFetch}>{children}</FetchContext.Provider>
  );
};

export default FetchProvider;
