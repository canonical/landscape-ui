import React, { FC, ReactNode } from "react";
import axios, { AxiosError, AxiosInstance } from "axios";

import { API_URL } from "../constants";
import useAuth from "../hooks/useAuth";
import { generateRequestParams } from "../utils/api";

export const FetchContext = React.createContext<AxiosInstance | null>(null);

type FetchProviderProps = {
  children: ReactNode;
};

const FetchProvider: FC<FetchProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const authFetch = axios.create({
    baseURL: API_URL,
  });

  if (user && user.token) {
    authFetch.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `Bearer ${user.token}`;

        return generateRequestParams({ config });
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

export default FetchProvider;
