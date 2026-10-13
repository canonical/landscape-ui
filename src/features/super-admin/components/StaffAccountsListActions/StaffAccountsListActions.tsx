import ListActions from "@/components/layout/ListActions";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useEnterAccount } from "../../hooks";
import type { StaffAccountListItem } from "../../types";

interface StaffAccountsListActionsProps {
  readonly staffAccount: StaffAccountListItem;
}

const StaffAccountsListActions: FC<StaffAccountsListActionsProps> = ({
  staffAccount: { account },
}) => {
  const { enterAccount } = useEnterAccount();

  const actions: Action[] = [
    {
      icon: "switcher-environments",
      label: "Enter account",
      "aria-label": `Enter ${account}`,
      onClick: () => {
        enterAccount(account);
      },
    },
  ];

  return (
    <ListActions toggleAriaLabel={`${account} actions`} actions={actions} />
  );
};

export default StaffAccountsListActions;
