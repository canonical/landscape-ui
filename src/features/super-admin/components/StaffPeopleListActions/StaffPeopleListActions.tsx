import ListActions from "@/components/layout/ListActions";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useEnterAccount } from "../../hooks";
import type { StaffPeopleResult } from "../../types";

interface StaffPeopleListActionsProps {
  readonly result: StaffPeopleResult;
}

interface EnterableAccount {
  account: string;
  company: string;
}

/**
 * The accounts the row leads into: a person's memberships and the accounts
 * that invited them, or an invitation's target. Staff can enter any of them.
 */
const getAccounts = (result: StaffPeopleResult): EnterableAccount[] => {
  if (result.type !== "person") {
    return [{ account: result.account, company: result.company }];
  }

  const accounts = new Map<string, EnterableAccount>();

  for (const { account, company } of [
    ...result.accounts,
    ...result.pending_invitations,
  ]) {
    accounts.set(account, { account, company });
  }

  return [...accounts.values()];
};

const StaffPeopleListActions: FC<StaffPeopleListActionsProps> = ({
  result,
}) => {
  const { enterAccount } = useEnterAccount();

  const accounts = getAccounts(result);

  if (!accounts.length) {
    return null;
  }

  const actions: Action[] = accounts.map(({ account }) => ({
    icon: "switcher-environments",
    label: `Enter ${account}`,
    onClick: () => {
      enterAccount(account);
    },
  }));

  return (
    <ListActions toggleAriaLabel={`${result.name} actions`} actions={actions} />
  );
};

export default StaffPeopleListActions;
