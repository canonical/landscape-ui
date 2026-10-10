import ListActions from "@/components/layout/ListActions";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useEnterAccount } from "../../hooks";
import type { StaffPeopleResult } from "../../types";

interface StaffPeopleListActionsProps {
  readonly result: StaffPeopleResult;
}

/**
 * The names of the accounts the row leads into: a person's memberships and
 * the accounts that invited them, or an invitation's target. Staff can enter
 * any of them.
 */
const getAccounts = (result: StaffPeopleResult): string[] => {
  if (result.type !== "person") {
    return [result.account];
  }

  return [
    ...new Set(
      [...result.accounts, ...result.pending_invitations].map(
        ({ account }) => account,
      ),
    ),
  ];
};

const StaffPeopleListActions: FC<StaffPeopleListActionsProps> = ({
  result,
}) => {
  const { enterAccount } = useEnterAccount();

  const accounts = getAccounts(result);

  if (!accounts.length) {
    return null;
  }

  const actions: Action[] = accounts.map((account) => ({
    icon: "switcher-environments",
    label: `Enter ${account}`,
    onClick: () => {
      enterAccount(account);
    },
  }));

  // Duplicate records share a name and even an email, so the id is what
  // tells their toggles apart.
  return (
    <ListActions
      toggleAriaLabel={`${result.name} (${result.email}, #${result.id}) actions`}
      actions={actions}
    />
  );
};

export default StaffPeopleListActions;
