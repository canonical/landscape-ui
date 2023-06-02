import { IS_DEV_ENV } from "../constants";
import useNotify from "./useNotify";
import { AxiosError } from "axios";
import { ApiError } from "../types/ApiError";
import useAuth from "./useAuth";

export default function useDebug() {
  const notify = useNotify();
  const { logout } = useAuth();

  return (error: unknown) => {
    let message: string;

    if (error instanceof AxiosError<ApiError>) {
      message = error.message;

      if (401 === error.response?.status) {
        logout();
      }

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
