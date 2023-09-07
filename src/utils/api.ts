import { API_VERSION } from "../constants";
import { RequestSchema } from "../types/RequestSchema";
import { InternalAxiosRequestConfig } from "axios";

export const generateRequestParams = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const requestParams = ["get", "delete"].includes(config.method ?? "get")
    ? config.params
    : config.data;

  const urlParams = new URLSearchParams();

  const paramsToPass: Omit<RequestSchema, "signature"> = {
    action: config.url ?? "",
    version: API_VERSION,
  };

  for (let i = 0; i < Object.keys(requestParams ?? []).length; i++) {
    const param = Object.keys(requestParams)[i];
    const value = requestParams[param];

    if ("string" === typeof value && "" !== value) {
      paramsToPass[param] = value;
    } else if (Array.isArray(value)) {
      value.forEach((data, index) => {
        if ("string" === typeof data && "" !== data) {
          paramsToPass[`${param}.${index + 1}`] = data;
        }
      });
    } else if ("boolean" === typeof value) {
      paramsToPass[param] = `${value}`;
    } else if (
      "" !== value &&
      undefined !== value &&
      !(Array.isArray(value) && 0 === value.length)
    ) {
      throw new Error(
        `Unsupported argument type. Provided: ${value} for ${param}`,
      );
    }
  }

  for (const param of Object.keys(paramsToPass)) {
    urlParams.append(param, paramsToPass[param]);
  }

  if (["get", "delete"].includes(config.method ?? "get")) {
    config.params = paramsToPass;
  } else {
    config.data = paramsToPass;
  }

  config.url = "";

  config.headers["Content-Type"] = "application/json";

  return config;
};
