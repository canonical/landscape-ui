import useNotify from "@/hooks/useNotify";
import useSwitchAccount from "@/hooks/useSwitchAccount";
import { ROUTES } from "@/libs/routes";
import { useNavigate } from "react-router";
import { getErrorMessage } from "../helpers";

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
