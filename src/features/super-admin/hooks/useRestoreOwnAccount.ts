import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useSwitchAccount from "@/hooks/useSwitchAccount";
import { useEffect, useRef } from "react";
import { useOwnAccount } from "./useOwnAccount";

/**
 * Returns the session to the staff member's own account when it is still in
 * one entered for support, so that leaving super admin mode never opens the
 * dashboard of someone else's account. Checked once, when the user is known:
 * entering an account later switches the session away while the caller is
 * still rendered.
 */
export const useRestoreOwnAccount = () => {
  const debug = useDebug();
  const { user } = useAuth();
  const { ownAccount, isInForeignAccount } = useOwnAccount();
  const { switchAccount } = useSwitchAccount();
  const hasChecked = useRef(false);

  const hasUser = !!user;

  useEffect(() => {
    if (!hasUser || hasChecked.current) {
      return;
    }

    hasChecked.current = true;

    if (isInForeignAccount && ownAccount) {
      switchAccount(ownAccount.name).catch(debug);
    }
  }, [hasUser]);
};
