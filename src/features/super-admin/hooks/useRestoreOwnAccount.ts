import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useSwitchAccount from "@/hooks/useSwitchAccount";
import { useEffect, useRef, useState } from "react";
import { useOwnAccount } from "./useOwnAccount";

/**
 * Returns the session to the staff member's own account when it is still in
 * one entered for support, so that leaving super admin mode never opens the
 * dashboard of someone else's account. Checked once, when the user is known:
 * entering an account later switches the session away while the caller is
 * still rendered.
 *
 * `leavingAccount` names the account being left while the switch is in
 * flight, for the caller to show instead of pages the session is not in yet.
 */
export const useRestoreOwnAccount = () => {
  const debug = useDebug();
  const { user } = useAuth();
  const { ownAccount, isInForeignAccount } = useOwnAccount();
  const { switchAccount } = useSwitchAccount();
  const hasChecked = useRef(false);

  const hasUser = !!user;
  const needsRestoring = isInForeignAccount && !!ownAccount;

  // Known from the first render when the user already is, so that the
  // caller never shows the entered account's pages in between.
  const [leavingAccount, setLeavingAccount] = useState<string | null>(() =>
    needsRestoring && user ? user.current_account : null,
  );

  useEffect(() => {
    if (!hasUser || hasChecked.current) {
      return;
    }

    hasChecked.current = true;

    if (!needsRestoring || !ownAccount || !user) {
      return;
    }

    const accountToLeave = user.current_account;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLeavingAccount(accountToLeave);

    switchAccount(ownAccount.name)
      .catch(debug)
      .finally(() => {
        setLeavingAccount(null);
      });
  }, [hasUser]);

  return { leavingAccount };
};
