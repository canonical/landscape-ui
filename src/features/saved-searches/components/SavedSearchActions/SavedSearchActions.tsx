import type { FC } from "react";
import EditSavedSearchButton from "../EditSavedSearchButton";
import RemoveSavedSearchButton from "../RemoveSavedSearchButton";
import type { SavedSearch } from "../../types";
import classes from "./SavedSearchActions.module.scss";

interface SavedSearchActionsProps {
  readonly savedSearch: SavedSearch;
  readonly onSavedSearchRemove?: () => void;
  readonly onBackButtonPress?: () => void;
}

const SavedSearchActions: FC<SavedSearchActionsProps> = ({
  savedSearch,
  onSavedSearchRemove,
  onBackButtonPress,
}) => {
  return (
    <div className={classes.actions}>
      <EditSavedSearchButton
        savedSearch={savedSearch}
        onBackButtonPress={onBackButtonPress}
      />
      <RemoveSavedSearchButton
        savedSearch={savedSearch}
        onSavedSearchRemove={onSavedSearchRemove}
      />
    </div>
  );
};

export default SavedSearchActions;
