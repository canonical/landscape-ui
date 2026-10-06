import ListActions from "@/components/layout/ListActions";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useEnterAccount } from "../../hooks";
import type { StaffPeopleResult } from "../../types";

interface StaffPeopleListActionsProps {
  readonly result: StaffPeopleResult;
}

/**
 * The accounts the row leads into: a person's memberships and the accounts
 * that invited them, or an invitation's target. Staff can enter any of them.
 */
const getAccountNames = (result: StaffPeopleResult): string[] =>
  result.type === "person"
    ? [
        ...new Set([
          ...result.accounts.map(({ account }) => account),
          ...result.pending_invitations.map(({ account }) => account),
        ]),
      ]
    : [result.account];

const StaffPeopleListActions: FC<StaffPeopleListActionsProps> = ({
  result,
}) => {
  const { enterAccount, isEnteringAccount } = useEnterAccount();

  const accountNames = getAccountNames(result);

  if (!accountNames.length) {
    return null;
  }

  const actions: Action[] = accountNames.map((account) => ({
    icon: "switcher-environments",
    label: `Enter ${account}`,
    disabled: isEnteringAccount,
    onClick: async () => enterAccount(account),
  }));

  return (
    <ListActions toggleAriaLabel={`${result.name} actions`} actions={actions} />
  );
};

export default StaffPeopleListActions;
