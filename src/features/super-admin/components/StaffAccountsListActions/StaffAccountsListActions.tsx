import ListActions from "@/components/layout/ListActions";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import type { StaffAccountListItem } from "../../types";

interface StaffAccountsListActionsProps {
  readonly staffAccount: StaffAccountListItem;
}

const StaffAccountsListActions: FC<StaffAccountsListActionsProps> = ({
  staffAccount: { account },
}) => {
  const actions: Action[] = [
    // A placeholder: entering an account lands with LNDENG-5100.
    {
      icon: "switcher-environments",
      label: "Enter account",
      "aria-label": `Enter ${account}`,
      disabled: true,
    },
  ];

  return (
    <ListActions toggleAriaLabel={`${account} actions`} actions={actions} />
  );
};

export default StaffAccountsListActions;
