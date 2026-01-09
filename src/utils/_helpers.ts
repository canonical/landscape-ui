import { API_VERSION } from "@/constants";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

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

  if (!requestParams) {
    return paramsToPass;
  }

  for (const param of Object.keys(requestParams)) {
    const value = requestParams[param];

    if ("string" === typeof value && "" !== value) {
      paramsToPass[param] = value;
    } else if (Array.isArray(value)) {
      if (0 !== value.length) {
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
      }
    } else if (["number", "boolean"].includes(typeof value)) {
      paramsToPass[param] = isOld ? `${value}` : value;
    } else if (typeof value === "object") {
      paramsToPass[param] =
        isOld || "get" === config.method ? JSON.stringify(value) : value;
    } else if ("" !== value && undefined !== value) {
      throw new Error(
        `Unsupported argument type. Provided: ${value} for ${param}`,
      );
    }
  }

  return paramsToPass;
};

export const hasOneItem = <T>(array: T[]): array is [T] => {
  return array.length === 1;
};

export const pluralize = (
  count: number,
  singularForm: string,
  pluralForm?: string,
) => {
  return count === 1 ? singularForm : (pluralForm ?? `${singularForm}s`);
};

export const pluralizeArray = <T>(
  items: T[],
  getSingularForm: (item: T) => string,
  pluralForm: string,
) => {
  return hasOneItem(items) ? getSingularForm(items[0]) : pluralForm;
};

export const getTitleByName = (
  name: string,
  response: AxiosResponse<{ name: string; title: string }[]> | undefined,
) => {
  if (!response) {
    return name;
  }

  const item = response.data.find((i) => i.name === name);

  if (item) {
    return item.title;
  }

  return name;
};

export const mapTuple = <TArray extends readonly unknown[], TResult>(
  items: TArray,
  toItem: (item: TArray[number]) => TResult,
) => {
  return items.map(toItem) as { [K in keyof TArray]: TResult };
};

export const hasProperty = <T extends object>(
  obj: T,
  prop: PropertyKey,
): prop is keyof T => {
  return prop in obj;
};
