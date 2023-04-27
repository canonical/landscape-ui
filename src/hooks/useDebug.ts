import { IS_DEV_ENV } from "../constants";

export default function useDebug() {
  return (error: any) => {
    const message =
      error?.response?.data.message ?? error?.message ?? "Unknown error";

    if (IS_DEV_ENV) {
      console.error(message, error);
    }
  };
}
