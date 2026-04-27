import type { FC, ReactNode } from "react";
import React, {
  useContext,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
} from "react";
import type { AxiosInstance } from "axios";
import axios from "axios";
import { API_URL_DEB_ARCHIVE } from "@/constants";
import { AuthContext } from "@/context/auth";
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from "@/api/interceptors";

export const FetchDebArchiveContext = React.createContext<AxiosInstance | null>(
  null,
);

interface FetchDebArchiveProviderProps {
  readonly children: ReactNode;
}

const FetchDebArchiveProvider: FC<FetchDebArchiveProviderProps> = ({
  children,
}) => {
  const { user, logout } = useContext(AuthContext);

  const authFetchDebArchive = useMemo(() => {
    return axios.create({ baseURL: API_URL_DEB_ARCHIVE });
  }, []);

  const getLatestToken = useEffectEvent(() => {
    return user?.token;
  });

  const onLogout = useEffectEvent(() => {
    logout();
  });

  useLayoutEffect(() => {
    const cleanupRequest = setupRequestInterceptor(
      authFetchDebArchive,
      getLatestToken,
      false,
    );

    const cleanupResponse = setupResponseInterceptor(
      authFetchDebArchive,
      () => onLogout,
    );

    return () => {
      cleanupRequest();
      cleanupResponse();
    };
  }, [authFetchDebArchive]);

  return (
    <FetchDebArchiveContext.Provider value={authFetchDebArchive}>
      {children}
    </FetchDebArchiveContext.Provider>
  );
};

export default FetchDebArchiveProvider;
