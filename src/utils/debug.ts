import { IS_DEV_ENV } from "../constants";

export const consoleErrorMessage = (error: any) => {
  if (IS_DEV_ENV) {
    console.error(
      error?.response?.data.message ?? error?.message ?? "Unknown error",
      error
    );
  }
};
