import type { FC } from "react";
import CreateSavedSearchButton from "../CreateSavedSearchButton";
import classes from "./SearchPrompt.module.scss";

interface SearchPromptProps {
  readonly onSearchSave: () => void;
  readonly search: string;
}

const SearchPrompt: FC<SearchPromptProps> = ({ onSearchSave, search }) => {
  return (
    <>
      {search && (
        <div className={classes.container}>
          <span className={classes.prompt}>
            <span>Search for </span>
            <span className="p-search-and-filter__search-query">{search}</span>
            <span>...</span>
          </span>

          <CreateSavedSearchButton
            buttonLabel="Save search"
            appearance="link"
            className={classes.saveButton}
            afterCreate={onSearchSave}
            search={search}
          />
        </div>
      )}
    </>
  );
};

export default SearchPrompt;
