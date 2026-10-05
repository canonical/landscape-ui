import useDebug from "@/hooks/useDebug";
import useSwitchAccount from "@/hooks/useSwitchAccount";
import { ROUTES } from "@/libs/routes";
import { useNavigate } from "react-router";

/** Enters the account named `name` as Canonical staff and opens its support session. */
export const useEnterAccount = () => {
  const debug = useDebug();
  const navigate = useNavigate();
  const { switchAccount, isSwitchingAccount } = useSwitchAccount();

  const enterAccount = async (name: string): Promise<void> => {
    try {
      await switchAccount(name);

      navigate(ROUTES.superAdmin.session(name));
    } catch (error) {
      debug(error);
    }
  };

  return { enterAccount, isEnteringAccount: isSwitchingAccount };
};
