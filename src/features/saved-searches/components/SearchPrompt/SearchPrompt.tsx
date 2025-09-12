import type { FC } from "react";
import { useState } from "react";
import { Button } from "@canonical/react-components";
import SavedSearchCreateForm from "../SavedSearchCreateForm";
import classes from "./SearchPrompt.module.scss";

interface SearchPromptProps {
  readonly onSearchSave: () => void;
  readonly search: string;
}

const SearchPrompt: FC<SearchPromptProps> = ({ onSearchSave, search }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      {search && showForm && (
        <SavedSearchCreateForm
          onClose={() => {
            setShowForm(false);
          }}
          onSearchSave={onSearchSave}
          search={search}
        />
      )}

      {search && !showForm && (
        <div className={classes.container}>
          <span className={classes.prompt}>
            <span>Search for </span>
            <span className="p-search-and-filter__search-query">{search}</span>
            <span>...</span>
          </span>

          <Button
            type="button"
            appearance="link"
            onClick={() => {
              setShowForm(true);
            }}
            className={classes.saveButton}
          >
            Save search
          </Button>
        </div>
      )}
    </>
  );
};

export default SearchPrompt;
