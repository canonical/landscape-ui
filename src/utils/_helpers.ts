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
  isOld && config.method === "get"
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
      paramsToPass[param] =
        isOld && config.method === "get" ? `${value}` : value;
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

export const hasOneItem = <T>(array: readonly T[]): array is readonly [T] => {
  return array.length === 1;
};

export const pluralize = (
  count: number,
  singularForm: string,
  pluralForm?: string,
) => {
  return count === 1 ? singularForm : (pluralForm ?? `${singularForm}s`);
};

export const pluralizeWithCount = (
  count: number,
  singularForm: string,
  pluralForm?: string,
) => {
  return `${count.toLocaleString()} ${pluralize(count, singularForm, pluralForm)}`;
};

export const pluralizeNew = (
  count = 0,
  singularForm: string,
  options: { pluralForm?: string; showCount?: "exact" | "limited" } = {},
) =>
  `${options.showCount ? `${count}${options.showCount === "limited" ? "+" : ""} ` : ""}${count === 1 ? singularForm : (options.pluralForm ?? `${singularForm}s`)}`;

export const pluralizeArray = <T>(
  items: readonly T[],
  getSingularForm: (item: T) => string,
  pluralForm: string,
) => {
  return hasOneItem(items)
    ? getSingularForm(items[0])
    : `${items.length.toLocaleString()} ${pluralForm}`;
};

export const capitalize = <T extends string>(s: T) =>
  (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<typeof s>;

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
