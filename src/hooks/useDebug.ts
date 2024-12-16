import { isAxiosError } from "axios";
import { IS_DEV_ENV } from "@/constants";
import { ApiError } from "@/types/ApiError";
import useNotify from "./useNotify";

export default function useDebug() {
  const { notify } = useNotify();

  return (error: unknown) => {
    let message: string;

    if (isAxiosError<ApiError>(error) && error.response) {
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

    if (IS_DEV_ENV && !(error instanceof Error && error.cause === "test")) {
      console.error(message, error);
    }
  };
}
