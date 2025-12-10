import type { ApiError } from "@/types/api/ApiError";
import type { AxiosError } from "axios";
import { isAxiosError } from "axios";
import type { AutoinstallOverrideWarning } from "./types";

export const areTextsIdentical = (
  firstText: string,
  secondText: string,
): boolean => {
  return firstText === secondText;
};

export const isAutoinstallOverrideWarning = (
  value: unknown,
): value is AxiosError<AutoinstallOverrideWarning> => {
  if (isAxiosError<ApiError>(value) && value.response) {
    const { error } = value.response.data;
    return error === "AutoinstallOverrideWarning";
  }
  return false;
};

export const parseFields = (
  error: AxiosError<AutoinstallOverrideWarning>,
): string[] => {
  const match = error.response?.data.message.match(/overrides fields (.+)$/);

  return match?.[1] ? match[1].split(",").map((field) => field.trim()) : [];
};
