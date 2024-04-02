import { API_VERSION } from "@/constants";
import { RequestSchema } from "@/types/RequestSchema";
import { InternalAxiosRequestConfig } from "axios";

interface GenerateRequestParams {
  config: InternalAxiosRequestConfig;
  isOld?: boolean;
}

export const generateRequestParams = ({
  config,
  isOld = false,
}: GenerateRequestParams): InternalAxiosRequestConfig => {
  const requestParams = ["get", "delete"].includes(config.method ?? "get")
    ? config.params
    : config.data;

  const paramsToPassOld: Omit<RequestSchema, "signature"> = {
    action: config.url ?? "",
    version: API_VERSION,
  };
  const paramsToPassNew: Record<string, unknown> = {};

  const paramsToPass = isOld ? paramsToPassOld : paramsToPassNew;

  for (let i = 0; i < Object.keys(requestParams ?? []).length; i++) {
    const param = Object.keys(requestParams)[i];
    const value = requestParams[param];

    if ("string" === typeof value && "" !== value) {
      paramsToPass[param] = value;
    } else if (Array.isArray(value) && 0 !== value.length) {
      if (isOld) {
        value.forEach((data, index) => {
          if ("string" === typeof data && "" !== data) {
            paramsToPass[`${param}.${index + 1}`] = data;
          } else if ("number" === typeof data) {
            paramsToPass[`${param}.${index + 1}`] = `${data}`;
          }
        });
      } else {
        if (["put", "post", "patch"].includes(config.method ?? "get")) {
          paramsToPass[param] = value;
        } else {
          paramsToPass[param] = value.toString();
        }
      }
    } else if (["number", "boolean"].includes(typeof value)) {
      paramsToPass[param] = isOld ? `${value}` : value;
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

  if (["get", "delete"].includes(config.method ?? "get")) {
    config.params = paramsToPass;
  } else {
    config.data = paramsToPass;
  }

  if (isOld) {
    config.url = "";
  }

  config.headers["Content-Type"] = "application/json";

  return config;
};
