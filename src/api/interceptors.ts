import type { AxiosError, AxiosInstance } from "axios";
import { generateRequestParams } from "@/utils/api";

const NOT_AUTHORIZED_CODE = 401;

export const setupRequestInterceptor = (
  instance: AxiosInstance,
  getToken: () => string | undefined,
  isOldApi = false,
) => {
  const interceptorId = instance.interceptors.request.use(
    (config) => {
      const token = getToken();

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }

      return generateRequestParams({ config, isOld: isOldApi });
    },
    (error) => Promise.reject(error),
  );

  return () => {
    instance.interceptors.request.eject(interceptorId);
  };
};

export const setupResponseInterceptor = (
  instance: AxiosInstance,
  getLogout: () => (() => void) | undefined,
) => {
  const interceptorId = instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === NOT_AUTHORIZED_CODE) {
        const isLoginRequest =
          error.config?.url?.includes("login") ||
          error.config?.url?.includes("auth");

        if (!isLoginRequest) {
          const logout = getLogout();
          if (logout) {
            logout();
          }
        }
      }
      return Promise.reject(error);
    },
  );

  return () => {
    instance.interceptors.response.eject(interceptorId);
  };
};
