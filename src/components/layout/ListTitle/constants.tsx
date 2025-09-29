import classes from "./ListTitle.module.scss";

export const LIST_TITLE_COLUMN_PROPS = {
  accessor: "title",
  id: "title",
  Header: (
    <div className={classes.header}>
      Title
      <span className="u-text--muted">Name</span>
    </div>
  ),
};
