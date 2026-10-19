import useAuth from "@/hooks/useAuth";

/**
 * The staff member's own account to fall back to after a support session,
 * `null` when they have none; and whether the session is in another account.
 */
export const useOwnAccount = () => {
  const { user } = useAuth();

  const ownAccount =
    user?.accounts.find(({ default: isDefault }) => isDefault) ??
    user?.accounts[0] ??
    null;

  const isInForeignAccount =
    !!user?.current_account &&
    !user.accounts.some(({ name }) => name === user.current_account);

  return { ownAccount, isInForeignAccount };
};
