import React, { FC, ReactNode } from "react";
import axios, { AxiosError, AxiosInstance } from "axios";

import { API_URL } from "../constants";
import { generateRequestParams } from "../utils/api";

export const FetchContext = React.createContext<AxiosInstance | null>(null);

type FetchProviderProps = {
  children: ReactNode;
};

const FetchProvider: FC<FetchProviderProps> = ({ children }) => {
  const authFetch = axios.create({
    baseURL: API_URL,
  });

  authFetch.interceptors.request.use(
    (config) => {
      return generateRequestParams(config);
    },
    (error: AxiosError) => {
      Promise.reject(error);
    }
  );

  return (
    <FetchContext.Provider value={authFetch}>{children}</FetchContext.Provider>
  );
};

export default FetchProvider;
