import type { FC } from "react";
import EditSavedSearchButton from "../EditSavedSearchButton";
import RemoveSavedSearchButton from "../RemoveSavedSearchButton";
import type { SavedSearch } from "../../types";
import classes from "./SavedSearchActions.module.scss";

interface SavedSearchActionsProps {
  readonly savedSearch: SavedSearch;
  readonly onSavedSearchRemove?: () => void;
}

const SavedSearchActions: FC<SavedSearchActionsProps> = ({
  savedSearch,
  onSavedSearchRemove,
}) => {
  return (
    <div className={classes.actions}>
      <EditSavedSearchButton savedSearch={savedSearch} />
      <RemoveSavedSearchButton
        savedSearch={savedSearch}
        onSavedSearchRemove={onSavedSearchRemove}
      />
    </div>
  );
};

export default SavedSearchActions;
