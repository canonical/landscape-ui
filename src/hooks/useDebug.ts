import { isAxiosError } from "axios";
import { IS_DEV_ENV } from "@/constants";
import type { ApiError } from "@/types/api/ApiError";
import useNotify from "./useNotify";

export default function useDebug() {
  const { notify } = useNotify();

  return (error: unknown) => {
    let message: string;

    if (isAxiosError<ApiError>(error) && error.response) {
      // eslint-disable-next-line prefer-destructuring
      message = error.response.data.message;

      if (IS_DEV_ENV) {
        console.error(error.response);
      }
    } else if (error instanceof Error) {
      // eslint-disable-next-line prefer-destructuring
      message = error.message;
    } else {
      message = "Unknown error";
    }

    notify.error({ message, error });

    if (IS_DEV_ENV && !(error instanceof Error && error.cause === "test")) {
      console.error(message, error);
    }
  };
}
