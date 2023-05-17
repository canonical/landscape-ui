import { IS_DEV_ENV } from "../constants";
import useNotify from "./useNotify";
import { AxiosError } from "axios";

export default function useDebug() {
  const notify = useNotify();

  return (error: unknown) => {
    let message: string;

    if (error instanceof AxiosError) {
      message = error.message;

      if (IS_DEV_ENV) {
        console.error(error.response);
      }
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = "Unknown error";
    }

    notify.error(message);

    if (IS_DEV_ENV) {
      console.error(message, error);
    }
  };
}
