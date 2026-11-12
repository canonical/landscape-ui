import { IS_DEV_ENV } from "@/constants";
import type { ApiError } from "@/types/api/ApiError";
import { isAxiosError } from "axios";
import useNotify from "./useNotify";

export default function useDebug() {
  const { notify } = useNotify();

  return (error: unknown) => {
    let errorMessage: string;

    if (isAxiosError<ApiError>(error) && error.response) {
      const { message } = error.response.data;
      errorMessage = message;

      if (IS_DEV_ENV) {
        console.error(error.response);
      }
    } else if (error instanceof Error && error.message) {
      const { message } = error;
      errorMessage = message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      errorMessage = "Unknown error";
    }

    notify.error({ message: errorMessage, error });

    if (IS_DEV_ENV && !(error instanceof Error && error.cause === "test")) {
      console.error(errorMessage, error);
    }
  };
}
