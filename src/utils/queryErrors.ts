import { isAxiosError } from "axios";

const NOT_FOUND_STATUS = 404;

export const rethrowWithNotFoundMessage = (
  error: unknown,
  notFoundMessage: string,
): never => {
  if (isAxiosError(error) && error.response?.status === NOT_FOUND_STATUS) {
    throw new Error(notFoundMessage);
  }

  throw error;
};
