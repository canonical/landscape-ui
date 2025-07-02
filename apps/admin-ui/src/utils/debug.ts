import { IS_DEV_ENV } from "@/constants";
import { AxiosError } from "axios";

export const consoleErrorMessage = (error: unknown) => {
  if (IS_DEV_ENV) {
    if (error instanceof AxiosError && error.response) {
      console.error(error.response.data.message, error);
    } else {
      console.error(
        error instanceof Error ? error.message : "Unknown error",
        error,
      );
    }
  }
};

export const assertNever = (argValue: never, argLabel: string): never => {
  throw new Error(
    `Unsupported argument type. Provided: ${argValue} for ${argLabel}`,
  );
};
