import type { InternalAxiosRequestConfig } from "axios";
import { API_VERSION } from "@/constants";

const figureRequestParams = (config: InternalAxiosRequestConfig) =>
  ["get", "delete"].includes(config.method ?? "get")
    ? config.params
    : config.data;

const initParamsToPass = ({
  config,
  isOld,
}: {
  config: InternalAxiosRequestConfig;
  isOld: boolean;
}): Record<string, unknown> =>
  isOld
    ? {
        action: config.url ?? "",
        version: API_VERSION,
      }
    : {};

interface HandleParamsProps {
  config: InternalAxiosRequestConfig;
  isOld: boolean;
}

export const handleParams = ({
  config,
  isOld,
}: HandleParamsProps): Record<string, unknown> => {
  const requestParams = figureRequestParams(config);
  const paramsToPass = initParamsToPass({ config, isOld });

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
    } else if (typeof value === "object") {
      paramsToPass[param] =
        isOld || "get" === config.method ? JSON.stringify(value) : value;
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

  return paramsToPass;
};
