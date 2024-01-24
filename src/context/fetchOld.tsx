import React, { FC, ReactNode } from "react";
import axios, { AxiosError, AxiosInstance } from "axios";

import { API_URL_OLD } from "../constants";
import { generateRequestParams } from "../utils/api";
import useAuth from "../hooks/useAuth";

export const FetchContext = React.createContext<AxiosInstance | null>(null);

type FetchProviderProps = {
  children: ReactNode;
};

const FetchOldProvider: FC<FetchProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const authFetch = axios.create({
    baseURL: API_URL_OLD,
  });

  if (user && user.token) {
    authFetch.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `Bearer ${user.token}`;

        return generateRequestParams({ config, isOld: true });
      },
      (error: AxiosError) => {
        Promise.reject(error);
      },
    );
  }

  return (
    <FetchContext.Provider value={authFetch}>{children}</FetchContext.Provider>
  );
};

export default FetchOldProvider;
