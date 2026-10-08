import { ROUTES } from "@/libs/routes";
import { useNavigate } from "react-router";

/**
 * Ends the support session in the account named `name` by opening the
 * account's page. Super admin mode returns the session to the staff member's
 * own account from there (see `useRestoreOwnAccount`): doing it here would
 * leave a switch in flight under a route that is on its way out.
 */
export const useExitSupportSession = (name: string) => {
  const navigate = useNavigate();

  const exitSupportSession = () => {
    navigate(ROUTES.superAdmin.account(name));
  };

  return { exitSupportSession };
};
