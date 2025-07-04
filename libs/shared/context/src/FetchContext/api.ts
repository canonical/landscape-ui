import type { InternalAxiosRequestConfig } from "axios";
import { handleParams } from "./_helpers";

interface GenerateRequestParams {
  config: InternalAxiosRequestConfig;
  isOld?: boolean;
}

export const generateRequestParams = ({
  config,
  isOld = false,
}: GenerateRequestParams): InternalAxiosRequestConfig => {
  const params = handleParams({
    config,
    isOld,
  });

  if (["get", "delete"].includes(config.method ?? "get")) {
    config.params = params;
  } else {
    config.data = params;
  }

  if (isOld) {
    config.url = "";
  }

  config.headers["Content-Type"] = "application/json";

  return config;
};
