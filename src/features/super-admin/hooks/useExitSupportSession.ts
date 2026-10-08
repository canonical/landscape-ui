import useSwitchAccount from "@/hooks/useSwitchAccount";
import { ROUTES } from "@/libs/routes";
import { useNavigate } from "react-router";
import { useOwnAccount } from "./useOwnAccount";

/**
 * Ends the support session in the account named `name`: returns to the staff
 * member's own account, when they have one, and opens the account's page.
 * Throws when the switch back is refused, leaving the session where it is.
 */
export const useExitSupportSession = (name: string) => {
  const navigate = useNavigate();
  const { ownAccount } = useOwnAccount();
  const { switchAccount, isSwitchingAccount } = useSwitchAccount();

  const exitSupportSession = async (): Promise<void> => {
    if (ownAccount) {
      await switchAccount(ownAccount.name);
    }

    navigate(ROUTES.superAdmin.account(name));
  };

  return { exitSupportSession, isExitingSupportSession: isSwitchingAccount };
};
