import type { FC, ReactNode } from "react";
import React from "react";
import type { AxiosError, AxiosInstance } from "axios";
import axios from "axios";

import { API_URL } from "@/constants";
import useAuth from "../hooks/useAuth";
import { generateRequestParams } from "@/utils/api";

export const FetchContext = React.createContext<AxiosInstance | null>(null);

interface FetchProviderProps {
  readonly children: ReactNode;
}

const FetchProvider: FC<FetchProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const authFetch = axios.create({
    baseURL: API_URL,
  });

  authFetch.interceptors.request.use(
    (config) => {
      if (user?.token) {
        config.headers["Authorization"] = `Bearer ${user.token}`;
      }

      return generateRequestParams({ config });
    },
    (error: AxiosError) => {
      Promise.reject(error);
    },
  );

  return (
    <FetchContext.Provider value={authFetch}>{children}</FetchContext.Provider>
  );
};

export default FetchProvider;
