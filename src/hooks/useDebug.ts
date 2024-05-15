import { AxiosError } from "axios";
import { IS_DEV_ENV } from "@/constants";
import { ApiError } from "@/types/ApiError";
import useNotify from "./useNotify";

const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof error.error === "string" &&
    "message" in error &&
    typeof error.message === "string"
  );
};

export default function useDebug() {
  const { notify } = useNotify();

  return (error: unknown) => {
    let message: string;

    if (
      error instanceof AxiosError &&
      error.response &&
      isApiError(error.response.data)
    ) {
      message = error.response.data.message;

      if (IS_DEV_ENV) {
        console.error(error.response);
      }
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = "Unknown error";
    }

    notify.error({ message, error });

    if (IS_DEV_ENV) {
      console.error(message, error);
    }
  };
}
