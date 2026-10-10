import { useAuthHandle } from "@/features/auth";
import useAuthAccounts from "@/hooks/useAuthAccounts";

/** Switches the session to the account named `name` and applies its token. */
export default function useSwitchAccount() {
  const { switchAccountQuery } = useAuthHandle();
  const { handleAccountSwitch } = useAuthAccounts();

  const switchAccount = async (name: string): Promise<void> => {
    const { data } = await switchAccountQuery.mutateAsync({
      account_name: name,
    });

    handleAccountSwitch(data.token, name);
  };

  return {
    switchAccount,
    isSwitchingAccount: switchAccountQuery.isPending,
  };
}
