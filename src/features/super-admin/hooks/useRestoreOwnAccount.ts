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
 * dashboard of someone else's account. Checked whenever the session's account
 * is known or changes; entering an account opens its session elsewhere.
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
  // The account the session was last checked in: a switch landing later (an
  // entry still pending when the person came back) is caught as well.
  const checkedAccount = useRef<string | null>(null);

  const currentAccount = user?.current_account ?? null;
  const needsRestoring = isInForeignAccount && !!ownAccount;

  const [leavingAccount, setLeavingAccount] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<RestoreError | null>(null);

  // Known from the render the foreign account is noticed in, before the
  // effect starts the switch, so that the caller never shows its pages in
  // between. A refused switch is not pending: its error is shown instead.
  const noticedAccount =
    needsRestoring &&
    !leavingAccount &&
    restoreError?.account !== currentAccount
      ? currentAccount
      : null;

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
    if (!currentAccount || checkedAccount.current === currentAccount) {
      return;
    }

    checkedAccount.current = currentAccount;

    if (!needsRestoring || !ownAccount) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    restore(currentAccount, ownAccount.name);
  }, [currentAccount]);

  const retryRestore = () => {
    if (needsRestoring && ownAccount && user) {
      restore(user.current_account, ownAccount.name);
    }
  };

  return {
    leavingAccount: leavingAccount ?? noticedAccount,
    restoreError,
    retryRestore,
  };
};
