import useNotify from "@/hooks/useNotify";
import useSwitchAccount from "@/hooks/useSwitchAccount";
import { ROUTES } from "@/libs/routes";
import type { ApiError } from "@/types/api/ApiError";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router";

/** The server's message for a failed request, or the error's own. */
const getErrorMessage = (error: unknown): string => {
  if (isAxiosError<ApiError>(error) && error.response?.data.message) {
    return error.response.data.message;
  }

  return error instanceof Error ? error.message : "Unknown error";
};

/**
 * Enters the account named `name` as Canonical staff and opens its support
 * session. A refused switch is reported under the account's `title` and
 * leaves the current page alone.
 */
export const useEnterAccount = () => {
  const { notify } = useNotify();
  const navigate = useNavigate();
  const { switchAccount, isSwitchingAccount } = useSwitchAccount();

  const enterAccount = async (name: string, title = name): Promise<void> => {
    try {
      await switchAccount(name);

      navigate(ROUTES.superAdmin.session(name));
    } catch (error) {
      notify.error({
        title: `Could not enter ${title}`,
        message: getErrorMessage(error),
        error,
      });
    }
  };

  return { enterAccount, isEnteringAccount: isSwitchingAccount };
};
