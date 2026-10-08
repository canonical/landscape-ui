import useAuth from "@/hooks/useAuth";
import useSwitchAccount from "@/hooks/useSwitchAccount";
import { useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../helpers";
import { useOwnAccount } from "./useOwnAccount";

/** A switch back that was refused: the account still entered, and why. */
export interface RestoreError {
  readonly account: string;
  readonly message: string;
}

/**
 * Returns the session to the staff member's own account when it is still in
 * one entered for support, so that leaving super admin mode never opens the
 * dashboard of someone else's account. Checked once, when the user is known:
 * entering an account later switches the session away while the caller is
 * still rendered.
 *
 * `leavingAccount` names the account being left while the switch is in
 * flight, for the caller to show instead of pages the session is not in yet.
 * `restoreError` is set when the switch was refused, until `retryRestore`
 * tries it again.
 */
export const useRestoreOwnAccount = () => {
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
  const [restoreError, setRestoreError] = useState<RestoreError | null>(null);

  const restore = (accountToLeave: string, ownAccountName: string) => {
    setLeavingAccount(accountToLeave);
    setRestoreError(null);

    switchAccount(ownAccountName)
      .catch((error: unknown) => {
        setRestoreError({
          account: accountToLeave,
          message: getErrorMessage(error),
        });
      })
      .finally(() => {
        setLeavingAccount(null);
      });
  };

  useEffect(() => {
    if (!hasUser || hasChecked.current) {
      return;
    }

    hasChecked.current = true;

    if (!needsRestoring || !ownAccount || !user) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    restore(user.current_account, ownAccount.name);
  }, [hasUser]);

  const retryRestore = () => {
    if (needsRestoring && ownAccount && user) {
      restore(user.current_account, ownAccount.name);
    }
  };

  return { leavingAccount, restoreError, retryRestore };
};
