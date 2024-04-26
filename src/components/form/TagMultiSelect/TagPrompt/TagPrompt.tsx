import { FC } from "react";
import { Button } from "@canonical/react-components";
import classes from "./TagPrompt.module.scss";

interface TagPromptProps {
  onTagAdd: () => void;
  search: string;
}

const TagPrompt: FC<TagPromptProps> = ({ onTagAdd, search }) => {
  return (
    <>
      {search && (
        <div className={classes.container}>
          <span className={classes.prompt}>
            <span>Search for </span>
            <span className="p-search-and-filter__search-query">{search}</span>
            <span>...</span>
          </span>

          <Button
            type="button"
            appearance="link"
            onClick={onTagAdd}
            className={classes.saveButton}
          >
            Add tag
          </Button>
        </div>
      )}
    </>
  );
};

export default TagPrompt;
