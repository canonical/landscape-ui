import classes from "./ListActions.module.scss";

export const LIST_ACTIONS_COLUMN_PROPS = {
  accessor: "actions",
  className: classes.actions,
  disableSortBy: true,
  Header: "Actions",
  meta: { ariaLabel: "Actions" },
};
