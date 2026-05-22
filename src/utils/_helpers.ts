import { API_VERSION } from "@/constants";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const figureRequestParams = (config: InternalAxiosRequestConfig) =>
  ["get", "delete"].includes(config.method ?? "get")
    ? (config.params as Record<string, unknown>)
    : (config.data as Record<string, unknown>);

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

export const isArray = (value: unknown): value is unknown[] =>
  Array.isArray(value);

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

    if (isArray(value)) {
      if (isOld) {
        for (const [index, data] of value.entries()) {
          const paramName = `${param}.${index + 1}`;

          switch (typeof data) {
            case "string":
              paramsToPass[paramName] = data;
              break;

            case "number":
              paramsToPass[paramName] = data.toString();
              break;

            default:
              throw new Error(
                `Unsupported array item type. Provided: ${data} for ${paramName}`,
              );
          }
        }
      } else {
        switch (config.method) {
          case "patch":
          case "post":
          case "put":
            paramsToPass[param] = value;
            break;

          default:
            paramsToPass[param] = value.toString();
        }
      }
    } else {
      switch (typeof value) {
        case "string":
          paramsToPass[param] = value;
          break;

        case "number":
        case "boolean":
          if (isOld && config.method === "get") {
            paramsToPass[param] = value.toString();
          } else {
            paramsToPass[param] = value;
          }

          break;

        case "object":
          if (isOld || config.method === "get") {
            paramsToPass[param] = JSON.stringify(value);
          } else {
            paramsToPass[param] = value;
          }

          break;

        case "undefined":
          break;

        default:
          throw new Error(
            `Unsupported argument type. Provided: ${value} for ${param}`,
          );
      }
    }
  }

  return paramsToPass;
};

export const hasOneItem = <T>(array: readonly T[]): array is readonly [T] => {
  return array.length === 1;
};

export const pluralize = (
  count: number,
  [singularForm, pluralForm = `${singularForm}s`]: readonly [
    singular: string,
    plural?: string,
  ],
  countType: "none" | "exact" | "limited" = "none",
) => {
  const form = count === 1 ? singularForm : pluralForm;

  switch (countType) {
    case "none":
      return form;
    case "exact":
      return `${count.toLocaleString()} ${form}`;
    case "limited":
      return `${count.toLocaleString()}+ ${form}`;
  }
};

export const getSelectionLabel = <T>(
  items: readonly T[],
  getItemLabel: (item: T) => string,
  pluralForm: string,
) => {
  if (hasOneItem(items)) {
    return getItemLabel(items[0]);
  } else {
    return `${items.length.toLocaleString()} ${pluralForm}`;
  }
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
