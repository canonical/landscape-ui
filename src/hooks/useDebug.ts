import { IS_DEV_ENV } from "../constants";
import useNotify from "./useNotify";

export default function useDebug() {
  const notify = useNotify();

  return (error: any) => {
    const message =
      error?.response?.data.message ?? error?.message ?? "Unknown error";

    notify.error(message);

    if (IS_DEV_ENV) {
      console.error(message, error);
    }
  };
}
