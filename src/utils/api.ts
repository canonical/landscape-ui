import type { InternalAxiosRequestConfig } from "axios";
import { handleParams } from "@/utils/_helpers";
import { API_VERSION } from "@/constants";

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

    if (isOld) {
      config.params = { action: config.url ?? "", version: API_VERSION };
    }
  }

  if (isOld) {
    config.url = "";
  }

  if (!isOld || config.method === "get") {
    config.headers["Content-Type"] = "application/json";
  } else {
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  return config;
};
